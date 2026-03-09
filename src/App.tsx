import { useEffect, useState } from 'react';
import { fetchMatches, Match } from './services/wikiService';
import { Clock, MapPin } from 'lucide-react';
import { teamInfo } from './data/teams';

const getTeamInfo = (teamName: string) => {
  return teamInfo[teamName] || { name: teamName, flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/40px-Flag_of_None.svg.png' };
};

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches()
      .then(data => {
        // Sort by timestamp
        data.sort((a, b) => a.timestamp - b.timestamp);
        setMatches(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Sort matches by timestamp and group by date
  const sortedMatches = [...matches].sort((a, b) => {
    if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
    return 0;
  });

  const groupedMatches = sortedMatches.reduce((acc, match) => {
    // Extract date from datetimeHcm (format: "HH:mm - dd/MM/yyyy")
    // If datetimeHcm is empty, fallback to dateStr
    let dateKey = 'Chưa xác định';
    if (match.datetimeHcm) {
      const parts = match.datetimeHcm.split(' - ');
      if (parts.length === 2) {
        dateKey = parts[1];
      }
    } else if (match.dateStr) {
      dateKey = match.dateStr;
    }
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  return (
    <div className="min-h-screen bg-white font-sans text-[#222]">
      {/* Header similar to vnexpress */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50">
        <div className="max-w-[1160px] mx-auto px-4 h-14 flex items-center">
          <div className="text-2xl font-bold text-[#9f224e] tracking-tighter">VnExpress</div>
          <div className="ml-6 text-sm font-medium text-gray-600 border-l border-gray-300 pl-6">
            Thể thao
          </div>
        </div>
      </header>

      <main className="max-w-[1160px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content Area - 680px width as requested */}
        <div className="w-full lg:w-[680px] shrink-0">
          <div className="mb-6">
            <h1 className="text-[32px] font-bold mb-4 leading-tight text-[#222]">
              Lịch thi đấu World Cup 2026
            </h1>
            <p className="text-[#4f4f4f] text-[18px] leading-[160%] mb-6">
              Cập nhật lịch thi đấu chi tiết của VCK World Cup 2026 diễn ra tại Mỹ, Canada và Mexico. Giờ thi đấu đã được chuyển sang giờ Việt Nam (TP.HCM).
            </p>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#9f224e] border-t-transparent rounded-full mx-auto mb-4"></div>
              Đang tải dữ liệu...
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedMatches).map(([date, dateMatches]) => (
                <div key={date} className="border border-[#e5e5e5] rounded overflow-hidden">
                  <div className="bg-[#f7f7f7] px-4 py-3 border-b border-[#e5e5e5]">
                    <h2 className="text-[16px] font-bold text-[#9f224e] uppercase">
                      {date.includes('/') ? `Ngày ${date}` : date}
                    </h2>
                  </div>
                  <div className="divide-y divide-[#e5e5e5]">
                    {dateMatches.map(match => (
                      <div key={match.id} className="p-4 hover:bg-[#f9f9f9] transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          {/* Time & Location */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center text-[#9f224e] font-bold text-[15px]">
                              <Clock className="w-4 h-4 mr-2" />
                              {match.datetimeHcm ? match.datetimeHcm.split(' - ')[0] : 'Chưa xác định'}
                            </div>
                            <div className="flex items-center text-[#757575] text-[13px]">
                              <MapPin className="w-[14px] h-[14px] mr-1" />
                              {match.location}
                            </div>
                            <div className="text-[13px] text-[#757575] mt-1 flex items-center gap-2">
                              <span className="font-semibold text-[#444]">{match.group}</span>
                              <span className="text-[#ccc]">|</span>
                              <span>{match.matchNum}</span>
                            </div>
                          </div>

                          {/* Teams */}
                          <div className="flex-[1.5] flex items-center justify-center gap-4">
                            <div className="flex-1 flex items-center justify-end gap-2 text-right font-bold text-[16px] text-[#222]">
                              <span>{getTeamInfo(match.home).name}</span>
                              <img src={getTeamInfo(match.home).flag} alt={match.home} className="w-6 h-4 object-cover border border-gray-200" referrerPolicy="no-referrer" />
                            </div>
                            <div className="px-3 py-1 bg-[#f2f2f2] rounded text-[13px] font-bold text-[#757575]">
                              VS
                            </div>
                            <div className="flex-1 flex items-center justify-start gap-2 text-left font-bold text-[16px] text-[#222]">
                              <img src={getTeamInfo(match.away).flag} alt={match.away} className="w-6 h-4 object-cover border border-gray-200" referrerPolicy="no-referrer" />
                              <span>{getTeamInfo(match.away).name}</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block w-[300px] shrink-0 space-y-6">
          <div className="bg-[#f2f2f2] h-[600px] flex items-center justify-center text-[#757575] text-sm rounded border border-[#e5e5e5]">
            Quảng cáo
          </div>
        </aside>
      </main>
    </div>
  );
}
