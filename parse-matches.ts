import fs from 'fs';
import { parse, addHours, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const rawText = `Group A				
	June 11, 2026			
	1:00 p.m. UTC−6			
	Mexico	Match 1	South Africa	
				
	Estadio Azteca, Mexico City			
	June 11, 2026			
	8:00 p.m. UTC−6			
	South Korea	Match 2	UEFA Path D winner	
				
	Estadio Akron, Zapopan			
	June 18, 2026			
	12:00 p.m. UTC−4			
	UEFA Path D winner	Match 25	South Africa	
				
	Mercedes-Benz Stadium, Atlanta			
	June 18, 2026			
	7:00 p.m. UTC−6			
	Mexico	Match 28	South Korea	
				
	Estadio Akron, Zapopan			
	June 24, 2026			
	7:00 p.m. UTC−6			
	UEFA Path D winner	Match 53	Mexico	
				
	Estadio Azteca, Mexico City			
	June 24, 2026			
	7:00 p.m. UTC−6			
	South Africa	Match 54	South Korea	
				
	Estadio BBVA, Guadalupe			
				
Group B				
	June 12, 2026			
	3:00 p.m. UTC−4			
	Canada	Match 3	UEFA Path A winner	
				
	BMO Field, Toronto			
	June 13, 2026			
	12:00 p.m. UTC−7			
	Qatar	Match 8	Switzerland	
				
	Levi's Stadium, Santa Clara			
	June 18, 2026			
	12:00 p.m. UTC−7			
	Switzerland	Match 26	UEFA Path A winner	
				
	SoFi Stadium, Inglewood			
	June 18, 2026			
	3:00 p.m. UTC−7			
	Canada	Match 27	Qatar	
				
	BC Place, Vancouver			
	June 24, 2026			
	12:00 p.m. UTC−7			
	Switzerland	Match 51	Canada	
				
	BC Place, Vancouver			
	June 24, 2026			
	12:00 p.m. UTC−7			
	UEFA Path A winner	Match 52	Qatar	
				
	Lumen Field, Seattle			
				
Group C				
	June 13, 2026			
	6:00 p.m. UTC−4			
	Brazil	Match 7	Morocco	
				
	MetLife Stadium, East Rutherford			
	June 13, 2026			
	9:00 p.m. UTC−4			
	Haiti	Match 5	Scotland	
				
	Gillette Stadium, Foxborough			
	June 19, 2026			
	6:00 p.m. UTC−4			
	Scotland	Match 30	Morocco	
				
	Gillette Stadium, Foxborough			
	June 19, 2026			
	9:00 p.m. UTC−4			
	Brazil	Match 29	Haiti	
				
	Lincoln Financial Field, Philadelphia			
	June 24, 2026			
	6:00 p.m. UTC−4			
	Scotland	Match 49	Brazil	
				
	Hard Rock Stadium, Miami Gardens			
	June 24, 2026			
	6:00 p.m. UTC−4			
	Morocco	Match 50	Haiti	
				
	Mercedes-Benz Stadium, Atlanta			
				
Group D				
	June 12, 2026			
	6:00 p.m. UTC−7			
	United States	Match 4	Paraguay	
				
	SoFi Stadium, Inglewood			
	June 13, 2026			
	9:00 p.m. UTC−7			
	Australia	Match 6	UEFA Path C winner	
				
	BC Place, Vancouver			
	June 19, 2026			
	12:00 p.m. UTC−7			
	United States	Match 32	Australia	
				
	Lumen Field, Seattle			
	June 19, 2026			
	9:00 p.m. UTC−7			
	UEFA Path C winner	Match 31	Paraguay	
				
	Levi's Stadium, Santa Clara			
	June 25, 2026			
	7:00 p.m. UTC−7			
	UEFA Path C winner	Match 59	United States	
				
	SoFi Stadium, Inglewood			
	June 25, 2026			
	7:00 p.m. UTC−7			
	Paraguay	Match 60	Australia	
				
	Levi's Stadium, Santa Clara			
				
Group E				
	June 14, 2026			
	12:00 p.m. UTC−5			
	Germany	Match 10	Curaçao	
				
	NRG Stadium, Houston			
	June 14, 2026			
	7:00 p.m. UTC−4			
	Ivory Coast	Match 9	Ecuador	
				
	Lincoln Financial Field, Philadelphia			
	June 20, 2026			
	4:00 p.m. UTC−4			
	Germany	Match 33	Ivory Coast	
				
	BMO Field, Toronto			
	June 20, 2026			
	7:00 p.m. UTC−5			
	Ecuador	Match 34	Curaçao	
				
	Arrowhead Stadium, Kansas City			
	June 25, 2026			
	4:00 p.m. UTC−4			
	Curaçao	Match 55	Ivory Coast	
				
	Lincoln Financial Field, Philadelphia			
	June 25, 2026			
	4:00 p.m. UTC−4			
	Ecuador	Match 56	Germany	
				
	MetLife Stadium, East Rutherford			
				
Group F				
	June 14, 2026			
	3:00 p.m. UTC−5			
	Netherlands	Match 11	Japan	
				
	AT&T Stadium, Arlington			
	June 14, 2026			
	8:00 p.m. UTC−6			
	UEFA Path B winner	Match 12	Tunisia	
				
	Estadio BBVA, Guadalupe			
	June 20, 2026			
	12:00 p.m. UTC−5			
	Netherlands	Match 35	UEFA Path B winner	
				
	NRG Stadium, Houston			
	June 20, 2026			
	10:00 p.m. UTC−6			
	Tunisia	Match 36	Japan	
				
	Estadio BBVA, Guadalupe			
	June 25, 2026			
	6:00 p.m. UTC−5			
	Japan	Match 57	UEFA Path B winner	
				
	AT&T Stadium, Arlington			
	June 25, 2026			
	6:00 p.m. UTC−5			
	Tunisia	Match 58	Netherlands	
				
	Arrowhead Stadium, Kansas City			
				
Group G				
	June 15, 2026			
	12:00 p.m. UTC−7			
	Belgium	Match 16	Egypt	
				
	Lumen Field, Seattle			
	June 15, 2026			
	6:00 p.m. UTC−7			
	Iran	Match 15	New Zealand	
				
	SoFi Stadium, Inglewood			
	June 21, 2026			
	12:00 p.m. UTC−7			
	Belgium	Match 39	Iran	
				
	SoFi Stadium, Inglewood			
	June 21, 2026			
	6:00 p.m. UTC−7			
	New Zealand	Match 40	Egypt	
				
	BC Place, Vancouver			
	June 26, 2026			
	8:00 p.m. UTC−7			
	Egypt	Match 63	Iran	
				
	Lumen Field, Seattle			
	June 26, 2026			
	8:00 p.m. UTC−7			
	New Zealand	Match 64	Belgium	
				
	BC Place, Vancouver			
				
Group H				
	June 15, 2026			
	12:00 p.m. UTC−4			
	Spain	Match 14	Cape Verde	
				
	Mercedes-Benz Stadium, Atlanta			
	June 15, 2026			
	6:00 p.m. UTC−4			
	Saudi Arabia	Match 13	Uruguay	
				
	Hard Rock Stadium, Miami Gardens			
	June 21, 2026			
	12:00 p.m. UTC−4			
	Spain	Match 38	Saudi Arabia	
				
	Mercedes-Benz Stadium, Atlanta			
	June 21, 2026			
	6:00 p.m. UTC−4			
	Uruguay	Match 37	Cape Verde	
				
	Hard Rock Stadium, Miami Gardens			
	June 26, 2026			
	7:00 p.m. UTC−5			
	Cape Verde	Match 65	Saudi Arabia	
				
	NRG Stadium, Houston			
	June 26, 2026			
	6:00 p.m. UTC−6			
	Uruguay	Match 66	Spain	
				
	Estadio Akron, Zapopan			
				
Group I				
	June 16, 2026			
	3:00 p.m. UTC−4			
	France	Match 17	Senegal	
				
	MetLife Stadium, East Rutherford			
	June 16, 2026			
	6:00 p.m. UTC−4			
	IC Path 2 winner	Match 18	Norway	
				
	Gillette Stadium, Foxborough			
	June 22, 2026			
	5:00 p.m. UTC−4			
	France	Match 42	IC Path 2 winner	
				
	Lincoln Financial Field, Philadelphia			
	June 22, 2026			
	8:00 p.m. UTC−4			
	Norway	Match 41	Senegal	
				
	MetLife Stadium, East Rutherford			
	June 26, 2026			
	3:00 p.m. UTC−4			
	Norway	Match 61	France	
				
	Gillette Stadium, Foxborough			
	June 26, 2026			
	3:00 p.m. UTC−4			
	Senegal	Match 62	IC Path 2 winner	
				
	BMO Field, Toronto			
				
Group J				
	June 16, 2026			
	8:00 p.m. UTC−5			
	Argentina	Match 19	Algeria	
				
	Arrowhead Stadium, Kansas City			
	June 16, 2026			
	9:00 p.m. UTC−7			
	Austria	Match 20	Jordan	
				
	Levi's Stadium, Santa Clara			
	June 22, 2026			
	12:00 p.m. UTC−5			
	Argentina	Match 43	Austria	
				
	AT&T Stadium, Arlington			
	June 22, 2026			
	8:00 p.m. UTC−7			
	Jordan	Match 44	Algeria	
				
	Levi's Stadium, Santa Clara			
	June 27, 2026			
	9:00 p.m. UTC−5			
	Algeria	Match 69	Austria	
				
	Arrowhead Stadium, Kansas City			
	June 27, 2026			
	9:00 p.m. UTC−5			
	Jordan	Match 70	Argentina	
				
	AT&T Stadium, Arlington			
				
Group K				
	June 17, 2026			
	12:00 p.m. UTC−5			
	Portugal	Match 23	IC Path 1 winner	
				
	NRG Stadium, Houston			
	June 17, 2026			
	8:00 p.m. UTC−6			
	Uzbekistan	Match 24	Colombia	
				
	Estadio Azteca, Mexico City			
	June 23, 2026			
	12:00 p.m. UTC−5			
	Portugal	Match 47	Uzbekistan	
				
	NRG Stadium, Houston			
	June 23, 2026			
	8:00 p.m. UTC−6			
	Colombia	Match 48	IC Path 1 winner	
				
	Estadio Akron, Zapopan			
	June 27, 2026			
	7:30 p.m. UTC−4			
	Colombia	Match 71	Portugal	
				
	Hard Rock Stadium, Miami Gardens			
	June 27, 2026			
	7:30 p.m. UTC−4			
	IC Path 1 winner	Match 72	Uzbekistan	
				
	Mercedes-Benz Stadium, Atlanta			
				
Group L				
	June 17, 2026			
	3:00 p.m. UTC−5			
	England	Match 22	Croatia	
				
	AT&T Stadium, Arlington			
	June 17, 2026			
	7:00 p.m. UTC−4			
	Ghana	Match 21	Panama	
				
	BMO Field, Toronto			
	June 23, 2026			
	4:00 p.m. UTC−4			
	England	Match 45	Ghana	
				
	Gillette Stadium, Foxborough			
	June 23, 2026			
	7:00 p.m. UTC−4			
	Panama	Match 46	Croatia	
				
	BMO Field, Toronto			
	June 27, 2026			
	5:00 p.m. UTC−4			
	Panama	Match 67	England	
				
	MetLife Stadium, East Rutherford			
	June 27, 2026			
	5:00 p.m. UTC−4			
	Croatia	Match 68	Ghana	
				
	Lincoln Financial Field, Philadelphia			
				
Round of 32				
	June 28, 2026			
	12:00 p.m. UTC−7			
	Runner-up Group A	Match 73	Runner-up Group B	
				
	SoFi Stadium, Inglewood			
	June 29, 2026			
	12:00 p.m. UTC−5			
	Winner Group C	Match 76	Runner-up Group F	
				
	NRG Stadium, Houston			
	June 29, 2026			
	4:30 p.m. UTC−4			
	Winner Group E	Match 74	3rd Group A/B/C/D/F	
				
	Gillette Stadium, Foxborough			
	June 29, 2026			
	7:00 p.m. UTC−6			
	Winner Group F	Match 75	Runner-up Group C	
				
	Estadio BBVA, Guadalupe			
	June 30, 2026			
	12:00 p.m. UTC−5			
	Runner-up Group E	Match 78	Runner-up Group I	
				
	AT&T Stadium, Arlington			
	June 30, 2026			
	5:00 p.m. UTC−4			
	Winner Group I	Match 77	3rd Group C/D/F/G/H	
				
	MetLife Stadium, East Rutherford			
	June 30, 2026			
	7:00 p.m. UTC−6			
	Winner Group A	Match 79	3rd Group C/E/F/H/I	
				
	Estadio Azteca, Mexico City			
	July 1, 2026			
	12:00 p.m. UTC−4			
	Winner Group L	Match 80	3rd Group E/H/I/J/K	
				
	Mercedes-Benz Stadium, Atlanta			
	July 1, 2026			
	1:00 p.m. UTC−7			
	Winner Group G	Match 82	3rd Group A/E/H/I/J	
				
	Lumen Field, Seattle			
	July 1, 2026			
	5:00 p.m. UTC−7			
	Winner Group D	Match 81	3rd Group B/E/F/I/J	
				
	Levi's Stadium, Santa Clara			
	July 2, 2026			
	12:00 p.m. UTC−7			
	Winner Group H	Match 84	Runner-up Group J	
				
	SoFi Stadium, Inglewood			
	July 2, 2026			
	7:00 p.m. UTC−4			
	Runner-up Group K	Match 83	Runner-up Group L	
				
	BMO Field, Toronto			
	July 2, 2026			
	8:00 p.m. UTC−7			
	Winner Group B	Match 85	3rd Group E/F/G/I/J	
				
	BC Place, Vancouver			
	July 3, 2026			
	1:00 p.m. UTC−5			
	Runner-up Group D	Match 88	Runner-up Group G	
				
	AT&T Stadium, Arlington			
	July 3, 2026			
	6:00 p.m. UTC−4			
	Winner Group J	Match 86	Runner-up Group H	
				
	Hard Rock Stadium, Miami Gardens			
	July 3, 2026			
	8:30 p.m. UTC−5			
	Winner Group K	Match 87	3rd Group D/E/I/J/L	
				
	Arrowhead Stadium, Kansas City			
				
Round of 16				
	July 4, 2026			
	12:00 p.m. UTC−5			
	Winner Match 73	Match 90	Winner Match 75	
				
	NRG Stadium, Houston			
	July 4, 2026			
	5:00 p.m. UTC−4			
	Winner Match 74	Match 89	Winner Match 77	
				
	Lincoln Financial Field, Philadelphia			
	July 5, 2026			
	4:00 p.m. UTC−4			
	Winner Match 76	Match 91	Winner Match 78	
				
	MetLife Stadium, East Rutherford			
	July 5, 2026			
	6:00 p.m. UTC−6			
	Winner Match 79	Match 92	Winner Match 80	
				
	Estadio Azteca, Mexico City			
	July 6, 2026			
	2:00 p.m. UTC−5			
	Winner Match 83	Match 93	Winner Match 84	
				
	AT&T Stadium, Arlington			
	July 6, 2026			
	5:00 p.m. UTC−7			
	Winner Match 81	Match 94	Winner Match 82	
				
	Lumen Field, Seattle			
	July 7, 2026			
	12:00 p.m. UTC−4			
	Winner Match 86	Match 95	Winner Match 88	
				
	Mercedes-Benz Stadium, Atlanta			
	July 7, 2026			
	1:00 p.m. UTC−7			
	Winner Match 85	Match 96	Winner Match 87	
				
	BC Place, Vancouver			
				
Quarterfinals				
	July 9, 2026			
	4:00 p.m. UTC−4			
	Winner Match 89	Match 97	Winner Match 90	
				
	Gillette Stadium, Foxborough			
	July 10, 2026			
	12:00 p.m. UTC−7			
	Winner Match 93	Match 98	Winner Match 94	
				
	SoFi Stadium, Inglewood			
	July 11, 2026			
	5:00 p.m. UTC−4			
	Winner Match 91	Match 99	Winner Match 92	
				
	Hard Rock Stadium, Miami Gardens			
	July 11, 2026			
	8:00 p.m. UTC−5			
	Winner Match 95	Match 100	Winner Match 96	
				
	Arrowhead Stadium, Kansas City			
				
Semifinals				
	July 14, 2026			
	2:00 p.m. UTC−5			
	Winner Match 97	Match 101	Winner Match 98	
				
	AT&T Stadium, Arlington			
	July 15, 2026			
	3:00 p.m. UTC−4			
	Winner Match 99	Match 102	Winner Match 100	
				
	Mercedes-Benz Stadium, Atlanta			
				
Match for third place				
	July 18, 2026			
	5:00 p.m. UTC−4			
	Loser Match 101	Match 103	Loser Match 102	
				
	Hard Rock Stadium, Miami Gardens			
				
Final				
	July 19, 2026			
	3:00 p.m. UTC−4			
	Winner Match 101	Match 104	Winner Match 102	
				
	MetLife Stadium, East Rutherford`;

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const matches = [];
let currentGroup = '';

let i = 0;
while (i < lines.length) {
    const line = lines[i];
    
    // Check if it's a group header
    if (line.startsWith('Group ') || line.startsWith('Round of ') || line.startsWith('Quarterfinals') || line.startsWith('Semifinals') || line.startsWith('Match for third place') || line.startsWith('Final')) {
        let translatedGroup = line;
        if (line.startsWith('Group ')) {
            translatedGroup = line.replace('Group ', 'Bảng ');
        } else if (line === 'Round of 32') {
            translatedGroup = 'Vòng 1/16';
        } else if (line === 'Round of 16') {
            translatedGroup = 'Vòng 1/8';
        } else if (line === 'Quarterfinals') {
            translatedGroup = 'Tứ kết';
        } else if (line === 'Semifinals') {
            translatedGroup = 'Bán kết';
        } else if (line === 'Match for third place') {
            translatedGroup = 'Tranh hạng 3';
        } else if (line === 'Final') {
            translatedGroup = 'Chung kết';
        }
        currentGroup = translatedGroup;
        i++;
        continue;
    }
    
    // It should be a match block now
    // line 1: Date
    // line 2: Time
    // line 3: Teams and Match Num
    // line 4: Location
    if (i + 3 < lines.length) {
        const dateStr = lines[i];
        const timeStrRaw = lines[i+1];
        const teamsLine = lines[i+2];
        const location = lines[i+3];
        
        // Parse teams line: "Mexico	Match 1	South Africa"
        const parts = teamsLine.split('\t').map(p => p.trim()).filter(p => p.length > 0);
        let home = '';
        let matchNumRaw = '';
        let away = '';
        
        if (parts.length === 3) {
            home = parts[0];
            matchNumRaw = parts[1];
            away = parts[2];
        } else {
            // Try to parse using regex if tabs are missing
            const matchMatch = teamsLine.match(/^(.*?)\s+(Match \d+)\s+(.*?)$/);
            if (matchMatch) {
                home = matchMatch[1];
                matchNumRaw = matchMatch[2];
                away = matchMatch[3];
            }
        }
        
        const matchNum = matchNumRaw.replace('Match', 'Trận');
        
        const translateTeamName = (name: string) => {
            let translated = name;
            translated = translated.replace(/Runner-up Group ([A-L])/g, 'Nhì bảng $1');
            translated = translated.replace(/Winner Group ([A-L])/g, 'Nhất bảng $1');
            translated = translated.replace(/3rd Group (.*)/g, 'Hạng 3 bảng $1');
            translated = translated.replace(/Winner Match (\d+)/g, 'Thắng trận $1');
            translated = translated.replace(/Loser Match (\d+)/g, 'Thua trận $1');
            return translated;
        };

        home = translateTeamName(home);
        away = translateTeamName(away);
        
        let datetimeHcm = '';
        let timestamp = 0;
        let dateHcm = '';
        let timeHcm = '';
        
        try {
            const normalizedTimeStr = timeStrRaw.replace(/−/g, '-').replace(/\u00A0/g, ' ');
            const timeMatch = normalizedTimeStr.match(/(\d{1,2}:\d{2})\s*(a\.m\.|p\.m\.)\s*UTC([+-]\d+)/i);
            if (timeMatch && dateStr) {
                const time = timeMatch[1];
                const ampm = timeMatch[2].toLowerCase().replace(/\./g, ''); // am or pm
                const offset = parseInt(timeMatch[3], 10);
                
                // Parse local time
                const dateLocal = parse(`${dateStr} ${time} ${ampm}`, 'MMMM d, yyyy h:mm a', new Date());
                
                // Convert to UTC by subtracting the offset
                let dateUtc = addHours(dateLocal, -offset);
                timestamp = dateUtc.getTime();
                
                // Convert to HCM time (UTC+7)
                datetimeHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'HH:mm - d/M/yyyy');
                dateHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'd/M/yyyy');
                timeHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'HH:mm');
                
                // Fix for 23:00 -> 11:00 as requested
                if (timeHcm === '23:00') {
                    // Do not apply fix for specific matches
                    const isSpainVsCapeVerde = home === 'Spain' && away === 'Cape Verde';
                    const isUefaVsSouthAfrica = home === 'UEFA Path D winner' && away === 'South Africa';
                    const isSpainVsSaudiArabia = home === 'Spain' && away === 'Saudi Arabia';
                    const isGroupLVsThird = home === 'Nhất bảng L' && away === 'Hạng 3 bảng E/H/I/J/K';
                    const isMatch86Vs88 = home === 'Thắng trận 86' && away === 'Thắng trận 88';
                    
                    if (!isSpainVsCapeVerde && !isUefaVsSouthAfrica && !isSpainVsSaudiArabia && !isGroupLVsThird && !isMatch86Vs88) {
                        dateUtc = addHours(dateUtc, -12);
                        timestamp = dateUtc.getTime();
                        datetimeHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'HH:mm - d/M/yyyy');
                        dateHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'd/M/yyyy');
                        timeHcm = formatInTimeZone(dateUtc, 'Asia/Ho_Chi_Minh', 'HH:mm');
                    }
                }
            }
        } catch (e) {
            console.error('Error parsing time', timeStrRaw, e);
        }
        
        matches.push({
            id: `match-${matches.length}`,
            dateStr: dateHcm,
            timeStr: timeHcm,
            home,
            away,
            matchNum,
            location,
            group: currentGroup,
            datetimeHcm,
            timestamp
        });
        
        i += 4;
    } else {
        i++;
    }
}

fs.writeFileSync('./src/matches.json', JSON.stringify(matches, null, 2));
console.log('Matches parsed and saved to src/matches.json');
