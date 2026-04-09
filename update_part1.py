import os

def patch(path, old, new):
    with open(path) as f: c = f.read()
    if old not in c:
        print('  skipped (already applied or not found):', path)
        return
    with open(path, 'w') as f: f.write(c.replace(old, new, 1))
    print('  patched:', path)

print('Part 1: WorkWithMe + cities...')

# WorkWithMe phrase fix
patch('src/pages/WorkWithMe.jsx',
    'no tourist traps',
    'only places worth your time')

# Italy: insert cities at top of regions array (compact format)
ITALY = (
    "  { name:'Rome', description:'The Vatican, the Forum, the piazzas."
    " June and July are relentless. April and October are the right calls."
    " Base yourself in Trastevere or Prati. Stay at least three days.',"
    " goodFor:['solo','partner','friends','family'], vibe:['city','culture','food'] },\n"
    "  { name:'Florence', description:\"You are here for the Uffizi,"
    " Brunelleschi's dome, and the bistecca. Three days done well is enough."
    " Base yourself in Oltrarno, south of the river.\","
    " goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },\n"
    "  { name:'Venice', description:'Go in November or February."
    " Smaller than it looks on a map, stranger than anything you have seen."
    " Skip the gondola. Take the vaporetto. Get deliberately lost.',"
    " goodFor:['solo','partner','friends'], vibe:['city','culture','romantic'] },\n"
    "  { name:'Milan', description:'Not a tourist city, which is the point."
    " Come for the Pinacoteca di Brera and the aperitivo culture in Navigli."
    " Skip it in August.',"
    " goodFor:['solo','partner','friends'], vibe:['city','food'] },\n"
)
patch('src/data/italy.js',
    'export const regions = [\n',
    'export const regions = [\n' + ITALY)

# Spain: insert cities at top of regions array (compact format)
SPAIN = (
    "  { name:'Madrid', description:'Bigger and more lived-in than Barcelona."
    " The Prado alone is worth the flight. Eat late, really late."
    " The city does not start until 9pm. Mercado de la Paz, not San Miguel.',"
    " goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },\n"
    "  { name:'Barcelona', description:'Gaudi is real and worth it."
    " The Gothic Quarter rewards slow walking. The beach is fine but not the reason to come."
    " Go in May or September. July is borderline unbearable.',"
    " goodFor:['solo','partner','friends','family'], vibe:['city','culture','coastal'] },\n"
    "  { name:'Seville', description:'The most beautiful city in Andalusia."
    " The Alcazar rivals the Alhambra and has shorter lines."
    " April for the Feria, which requires planning. August is genuinely brutal.',"
    " goodFor:['solo','partner','friends'], vibe:['city','culture','food'] },\n"
    "  { name:'San Sebastian', description:'The best food city in Europe"
    " by almost any measure. Pintxos bars in every street of the old town."
    " Three Michelin-starred restaurants within walking distance."
    " The beach is legitimately good.',"
    " goodFor:['solo','partner','friends'], vibe:['food','city','coastal'] },\n"
)
patch('src/data/spain.js',
    'export const regions = [\n',
    'export const regions = [\n' + SPAIN)

print('Done.')
