import { ShieldCheck, User, Snail } from "lucide-react";

function Profile({ rescues }) {
  const username = localStorage.getItem('snail-patrol-username') || 'Du';
  const mine = rescues.filter(r => r.username === username);
  return (
    <section className="card">
      <h2>Profil</h2>
      <div className="profile-box">
        <div className="avatar"><ShieldCheck size={36}/></div>
        <div>
          <h3>{username}</h3>
          <p>{mine.length} registrerade räddningar</p>
        </div>
      </div>
      <h3>Mina badges</h3>
      <div className="badges">
        <span>First Rescue</span>
        {mine.length >= 10 && <span>10 Rescues</span>}
        {mine.length >= 25 && <span>Snail Guardian</span>}
      </div>
    </section>
  );
}

export default Profile;