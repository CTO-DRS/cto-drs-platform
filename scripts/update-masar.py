#!/usr/bin/env python3
"""تحديث بيانات masar-al-lugha بعد نشر أول إصدار رسمي v4.8.0 على GitHub."""
import json

PATH = "/home/z/my-project/src/content/apps.json"
data = json.load(open(PATH, encoding="utf-8"))
app = next(a for a in data if a["slug"] == "masar-al-lugha")

app["status"] = "released"
app["version"] = "4.8.0"
app["releaseDate"] = "2026-10-24"
app["summary"]["ar"] = (
    "تطبيق مفتوح المصدر لتعلّم الإنجليزية والأردية ببطاقات FSRS الذكية "
    "ودروس متدرجة وعناصر لعبة — أول إصدار رسمي v4.8.0 متاح الآن."
)
app["summary"]["en"] = (
    "An open language-learning app: learn English & Urdu with smart FSRS flashcards, "
    "leveled lessons and gamification — first official release v4.8.0 is out."
)
app["description"]["ar"] = (
    "منصة تعلّم لغات مفتوحة المصدر مبنية بتقنية Flutter، تجعل تعلّم الإنجليزية والأردية "
    "تجربة ممتعة: بطاقات مراجعة ذكية تعتمد خوارزمية FSRS لجدولة التكرار المتباعد، "
    "دروس مقسّمة إلى مستويات متدرجة، ونظام تحفيز على طريقة الألعاب يحفظ اندفاعك في التعلّم. "
    "صدر أول إصدار رسمي v4.8.0 وتليه إصدارات متتابعة بوتيرة نشطة — حمّل APK من GitHub وابدأ رحلتك."
)
app["description"]["en"] = (
    "An open-source language learning platform built with Flutter. Learn English & Urdu the fun way: "
    "smart FSRS-based spaced-repetition flashcards, leveled lessons, and gamified motivation. "
    "The first official release v4.8.0 is out with active follow-up releases — "
    "grab the APK from GitHub and start your journey."
)
app["downloads"] = [
    {
        "label": {"ar": "تحميل APK (v4.8.0)", "en": "Download APK (v4.8.0)"},
        "url": "https://github.com/CTO-DRS/masar-al-lugha/releases/download/v4.8.0/masar-al-lugha-v4.8.0.apk",
        "kind": "apk",
    },
    {
        "label": {"ar": "كل الإصدارات على GitHub", "en": "All releases on GitHub"},
        "url": "https://github.com/CTO-DRS/masar-al-lugha/releases",
        "kind": "release",
    },
]
app["changelog"] = [
    {
        "version": "4.8.0",
        "date": "2026-10-24",
        "notes": [
            {"ar": "أول إصدار رسمي متاح للتحميل بصيغة APK", "en": "First official release available as APK download"},
            {"ar": "بطاقات FSRS ودروس متدرجة ونظام تحفيز بالألعاب", "en": "FSRS flashcards, leveled lessons and gamified motivation"},
        ],
    }
]

json.dump(data, open(PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print("masar-al-lugha updated:", app["status"], app["version"])
# تحقق سريع من صلاحية رابط APK
