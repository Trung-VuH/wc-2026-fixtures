import axios from 'axios';
import * as cheerio from 'cheerio';

async function fetchWiki() {
  const { data } = await axios.get('https://en.wikipedia.org/wiki/2026_FIFA_World_Cup', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  });
  const $ = cheerio.load(data);
  
  // Find match boxes
  const matches = $('.footballbox');
  console.log('Found matches:', matches.length);
  
  const results: any[] = [];
  
  let currentGroup = '';
  $('*').each((i, el) => {
    const $el = $(el);
    if ($el.is('h3')) {
        const text = $el.text().replace('[edit]', '').trim();
        if (text.startsWith('Group') || text.startsWith('Round of') || text.startsWith('Quarterfinals') || text.startsWith('Semifinals') || text.startsWith('Match for third place') || text.startsWith('Final')) {
            currentGroup = text;
        }
    } else if ($el.hasClass('footballbox')) {
        const dateStr = $el.find('.fdate span.bday').text().trim();
        const timeStr = $el.find('.ftime').text().trim();
        const home = $el.find('.fhome').text().trim();
        const away = $el.find('.faway').text().trim();
        const matchNum = $el.find('.fscore').text().trim();
        const location = $el.find('.fright [itemprop="location"]').text().trim();
        
        results.push({ dateStr, timeStr, home, away, matchNum, location, group: currentGroup });
    }
  });
  
  console.log(results.slice(0, 3));
}

fetchWiki().catch(console.error);
