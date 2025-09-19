

function toBag(skills){
return Array.from(new Set((skills||[]).map(s=>s.trim().toLowerCase())));
}


function score(userSkills, jobSkills){
// Jaccard-like score
const a = new Set(userSkills);
const b = new Set(jobSkills);
const inter = new Set([...a].filter(x=>b.has(x))).size;
const union = new Set([...a,...b]).size;
if(union===0) return 0;
return inter/union;
}


module.exports = {
rankJobsForUser(user, jobs){
const u = toBag(user.skills || []);
const scored = jobs.map(j=>({ job: j, score: score(u, toBag(j.skills || [])) }));
scored.sort((a,b)=>b.score - a.score);
return scored;
}
}