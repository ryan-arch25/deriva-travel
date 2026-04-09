export const regions = [
  { name:'Lisbon', description:'The capital moves slower than its reputation suggests. Base yourself in Mouraria or Intendente, not Bairro Alto. The best meals happen at lunch.', goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },
  { name:'Porto', description:'Grittier, more honest than Lisbon. The Douro riverbank is worth the walk. Eat at a tasca, not a restaurant with an English menu outside.', goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },
  { name:'Alentejo', description:'Flat plains, cork oaks, and very good wine. You come here to slow down. A car is essential. The villages do not perform for tourists.', goodFor:['partner','friends'], vibe:['countryside','food','relaxed'] },
  { name:'Algarve (off-season)', description:'September through October is when it makes sense. The cliffs are real. The summer crowds are gone. Stay inland and drive to the water.', goodFor:['partner','friends','family'], vibe:['coastal','outdoor'] },
  { name:'Azores', description:'Nine islands, mostly empty. Sao Miguel is the entry point. Flores is the reason to come back. Bring waterproof gear and low expectations for weather.', goodFor:['solo','partner','friends'], vibe:['outdoor','adventure','coastal'] },
]
export const restaurants = [
  { name:'Taberna da Rua das Flores', city:'Lisbon', neighborhood:'Chiado', priceTier:'$$', vibe:['local','low-key','natural wine'], goodFor:['solo','partner','friends'], note:'Petiscos done properly. Small plates, long lunches. No reservations, arrive early.', category:'Restaurant', isAdvisorPick:false },
  { name:'Cantina Ze Avillez', city:'Lisbon', neighborhood:'Chiado', priceTier:'$$', vibe:['stylish','local'], goodFor:['partner','friends'], note:'Casual side of the Avillez empire. Better value than the main restaurant and the food is nearly as good.', category:'Restaurant', isAdvisorPick:false },
  { name:'Solar dos Presuntos', city:'Lisbon', neighborhood:'Avenida', priceTier:'$$$', vibe:['local','group-friendly'], goodFor:['partner','friends','family'], note:'Old-school Portuguese dining room. Order the suckling pig. Book ahead.', category:'Restaurant', isAdvisorPick:false },
  { name:'Adega Santiago', city:'Porto', neighborhood:'Boavista', priceTier:'$', vibe:['local','low-key','cash only'], goodFor:['solo','partner','friends'], note:'No website, no frills, no problem. The best francesinha in the city. Arrive hungry.', category:'Restaurant', isAdvisorPick:false },
  { name:'DOP', city:'Porto', neighborhood:'Ribeira', priceTier:'$$$', vibe:['stylish','reservations needed'], goodFor:['partner','friends'], note:'Rui Paula runs a tight room. Seasonal menu focused on northern Portuguese ingredients. Worth the splurge.', category:'Restaurant', isAdvisorPick:false },
  { name:'O Alcaide', city:'Monsaraz', neighborhood:'Old Town', priceTier:'$$', vibe:['local','outdoor seating'], goodFor:['partner','friends'], note:'Inside the walled village. Alentejo classics: black pork, migas, a carafe of local red.', category:'Restaurant', isAdvisorPick:false },
]
export const stays = [
  { name:'Bairro Alto Hotel', city:'Lisbon', neighborhood:'Bairro Alto', priceTier:'$$$$', vibe:['stylish','central'], goodFor:['partner','friends'], note:'The rooftop alone is worth it. Beautifully restored 18th-century building. Service is serious.', category:'Stay', isAdvisorPick:false },
  { name:'Pensao Amor', city:'Lisbon', neighborhood:'Cais do Sodre', priceTier:'$$', vibe:['stylish','local'], goodFor:['solo','partner','friends'], note:'Former brothel, now a boutique guesthouse. Every room is different. Noisy neighborhood, light sleepers should know.', category:'Stay', isAdvisorPick:false },
  { name:'The Yeatman', city:'Porto', neighborhood:'Vila Nova de Gaia', priceTier:'$$$$', vibe:['stylish','romantic'], goodFor:['partner'], note:'Views of Porto from across the Douro. Wine-focused hotel with a serious cellar. The infinity pool overlooks the city.', category:'Stay', isAdvisorPick:false },
  { name:'Casa de Terena', city:'Terena', neighborhood:'Alentejo', priceTier:'$$', vibe:['low-key','rural','outdoor seating'], goodFor:['partner','friends'], note:'A converted farmhouse in a village most people drive past. Quiet in the best way. Good breakfasts.', category:'Stay', isAdvisorPick:false },
  { name:'Areias do Seixo', city:'Lourinha', neighborhood:'Silver Coast', priceTier:'$$$$', vibe:['stylish','outdoor seating','coastal'], goodFor:['partner'], note:'Dune-side eco resort, north of Lisbon. Feels genuinely remote. The kind of place people extend their stays.', category:'Stay', isAdvisorPick:false },
]
export const logistics = {
  bestTime:'May through June, or September through October. July and August are crowded and hot in Lisbon. The Azores are unpredictable year-round.',
  gettingAround:'Lisbon and Porto are walkable. For Alentejo and Algarve, rent a car. Trains connect the main cities reliably. Avoid buses for long hauls.',
  bookAhead:['Restaurants on weekends in Lisbon and Porto','The Yeatman and Bairro Alto Hotel fill fast in high season','Azores flights from mainland Portugal','Car rental in peak summer'],
  visaNotes:'EU citizens: no visa. US, UK, Canada: 90-day visa-free under the Schengen agreement. Check ETIAS requirements post-2025.',
}
