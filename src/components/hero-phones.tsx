import { Wallet, MessagesSquare, Keyboard, Clapperboard, Gamepad2, ShieldCheck } from "lucide-react";

export function HeroPhones() {
  return (
    <div className="phones-stage" aria-hidden>
      <div className="phones-glow" />
      <div className="phone ph-left">
        <div className="ph-screen">
          <div className="ph-row w60" />
          <div className="ph-row w90" />
          <div className="ph-row w75" />
          <div className="ph-tiles"><i /><i /><i /></div>
          <div className="ph-row w85" />
          <div className="ph-row w50" />
        </div>
      </div>
      <div className="phone ph-main">
        <div className="ph-notch" />
        <div className="ph-screen">
          <div className="ph-logo">DRS<small>APPS &amp; MORE</small></div>
          <div className="ph-row w80" />
          <div className="ph-tiles"><i /><i /><i /><i /></div>
          <div className="ph-row w65" />
          <div className="ph-btn-line" />
        </div>
      </div>
      <div className="phone ph-right">
        <div className="ph-screen">
          <div className="ph-row w70" />
          <div className="ph-tiles"><i /><i /></div>
          <div className="ph-row w90" />
          <div className="ph-row w55" />
          <div className="ph-btn-line" />
        </div>
      </div>
      <span className="float-icon fi-1"><Wallet size={17} /></span>
      <span className="float-icon fi-2"><MessagesSquare size={17} /></span>
      <span className="float-icon fi-3"><Keyboard size={17} /></span>
      <span className="float-icon fi-4"><Clapperboard size={17} /></span>
      <span className="float-icon fi-5"><Gamepad2 size={17} /></span>
      <span className="float-icon fi-6"><ShieldCheck size={17} /></span>
    </div>
  );
}
