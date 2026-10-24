#!/usr/bin/env python3
"""جلب البيانات الحقيقية لكل مستودعات حساب CTO-DRS من GitHub API:
الوصف، المواضيع، الإصدارات مع أصول التنزيل (APK...)، ومقتطف README.
النتيجة تُحفظ في scripts/github-real-data.json لتغذية تحديث الكتالوج."""
import json, base64, urllib.request, sys

OWNER = "CTO-DRS"
API = "https://api.github.com"

def token_from_env(path="/home/z/my-project/.env"):
    try:
        for line in open(path):
            if line.startswith("GITHUB_TOKEN="):
                return line.strip().split("=", 1)[1]
    except FileNotFoundError:
        pass
    return None

TOKEN = token_from_env()
HDRS = {"Accept": "application/vnd.github+json", "User-Agent": "cto-drs-catalog"}
if TOKEN:
    HDRS["Authorization"] = f"Bearer {TOKEN}"

def get(url, ok=(200,)):
    req = urllib.request.Request(url, headers=HDRS)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        return {"__http_error": e.code}

def main():
    repos = get(f"{API}/users/{OWNER}/repos?per_page=100&sort=updated")
    if isinstance(repos, dict):
        print("FAILED to list repos:", repos.get("message")); sys.exit(1)

    out = {}
    for r in repos:
        name = r["name"]
        entry = {
            "description": r.get("description"),
            "language": r.get("language"),
            "topics": r.get("topics") or [],
            "homepage": r.get("homepage") or None,
            "html_url": r["html_url"],
            "pushed_at": r.get("pushed_at"),
            "stars": r.get("stargazers_count", 0),
            "forks": r.get("forks_count", 0),
            "license": (r.get("license") or {}).get("spdx_id"),
            "releases": [],
            "readme_excerpt": None,
        }
        # الإصدارات + الأصول القابلة للتنزيل
        rels = get(f"{API}/repos/{OWNER}/{name}/releases?per_page=5")
        if isinstance(rels, list):
            for rel in rels:
                entry["releases"].append({
                    "tag": rel.get("tag_name"),
                    "name": rel.get("name"),
                    "published_at": rel.get("published_at"),
                    "prerelease": bool(rel.get("prerelease")),
                    "draft": bool(rel.get("draft")),
                    "body": (rel.get("body") or "")[:900],
                    "assets": [
                        {"name": a["name"], "size": a["size"],
                         "url": a["browser_download_url"], "downloads": a["download_count"]}
                        for a in (rel.get("assets") or [])
                    ],
                })
        # مقتطف README لاستخراج وصف وميزات حقيقية
        rm = get(f"{API}/repos/{OWNER}/{name}/readme")
        if isinstance(rm, dict) and "content" in rm:
            try:
                text = base64.b64decode(rm["content"]).decode("utf-8", "replace")
                entry["readme_excerpt"] = text[:3000]
            except Exception as e:
                entry["readme_excerpt"] = f"<decode error: {e}>"
        out[name] = entry

    with open("/home/z/my-project/scripts/github-real-data.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    # ملخص سريع
    print(f"{'repo':<26}{'rels':<6}{'assets':<8}apk?")
    for name, e in out.items():
        apk = any(a["name"].lower().endswith((".apk", ".aab")) for rel in e["releases"] for a in rel["assets"])
        print(f"{name:<26}{len(e['releases']):<6}{sum(len(rel['assets']) for rel in e['releases']):<8}{'YES' if apk else '-'}")
    print("saved -> scripts/github-real-data.json")

if __name__ == "__main__":
    main()
