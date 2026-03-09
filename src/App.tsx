import { useEffect, useState, useRef } from 'react';
import { fetchMatches, Match } from './services/wikiService';
import { Clock, MapPin, ChevronDown, X, Check } from 'lucide-react';
import { teamInfo } from './data/teams';

const getTeamInfo = (teamName: string) => {
  return teamInfo[teamName] || { name: teamName, flag: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/40px-Flag_of_None.svg.png' };
};

export default function App() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'date' | 'group'>('date');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const topTeams = [
    'Spain', 'Argentina', 'France', 'England', 'Brazil', 'Portugal', 
    'Netherlands', 'Belgium', 'Germany', 'Uruguay', 'Japan', 'South Korea'
  ];

  const allTeams = Object.keys(teamInfo)
    .filter(t => t !== 'Chưa xác định')
    .sort((a, b) => {
      const indexA = topTeams.indexOf(a);
      const indexB = topTeams.indexOf(b);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return teamInfo[a].name.localeCompare(teamInfo[b].name);
    });

  const toggleTeam = (team: string) => {
    setFavoriteTeams(prev => 
      prev.includes(team) ? prev.filter(t => t !== team) : [...prev, team]
    );
  };

  const filteredMatches = matches.filter(match => {
    if (favoriteTeams.length === 0) return true;
    return favoriteTeams.includes(match.home) || favoriteTeams.includes(match.away);
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (a.timestamp && b.timestamp) return a.timestamp - b.timestamp;
    return 0;
  });

  const groupedMatches = sortedMatches.reduce((acc, match) => {
    if (viewMode === 'date') {
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
    } else {
      const groupKey = match.group || 'Chưa xác định';
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(match);
    }
    return acc;
  }, {} as Record<string, Match[]>);

  let sortedKeys = Object.keys(groupedMatches);
  if (viewMode === 'date') {
    sortedKeys.sort((a, b) => {
      const timeA = groupedMatches[a][0].timestamp || 0;
      const timeB = groupedMatches[b][0].timestamp || 0;
      return timeA - timeB;
    });
  } else {
    const groupOrder = [
      'Bảng A', 'Bảng B', 'Bảng C', 'Bảng D', 'Bảng E', 'Bảng F',
      'Bảng G', 'Bảng H', 'Bảng I', 'Bảng J', 'Bảng K', 'Bảng L',
      'Vòng 1/16', 'Vòng 1/8', 'Tứ kết', 'Bán kết', 'Tranh hạng 3', 'Chung kết'
    ];
    sortedKeys.sort((a, b) => {
      const indexA = groupOrder.indexOf(a);
      const indexB = groupOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  }

  if (viewMode === 'group') {
    for (const key of sortedKeys) {
      groupedMatches[key].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }
  }

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

          {/* Filters */}
          <div className="mb-8 space-y-6">
            {/* View Mode Toggle */}
            <div className="flex bg-[#f2f2f2] p-1 rounded inline-flex">
              <button 
                onClick={() => setViewMode('date')}
                className={`px-5 py-2 rounded text-sm font-bold transition-colors ${viewMode === 'date' ? 'bg-white text-[#9f224e] shadow-sm' : 'text-[#757575] hover:text-[#222]'}`}
              >
                Xem theo ngày
              </button>
              <button 
                onClick={() => setViewMode('group')}
                className={`px-5 py-2 rounded text-sm font-bold transition-colors ${viewMode === 'group' ? 'bg-white text-[#9f224e] shadow-sm' : 'text-[#757575] hover:text-[#222]'}`}
              >
                Xem theo bảng
              </button>
            </div>

            {/* Favorite Teams Selector */}
            <div className="relative" ref={dropdownRef}>
              <h3 className="font-bold text-[#222] mb-3">Chọn đội bóng yêu thích:</h3>
              
              {favoriteTeams.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {favoriteTeams.map(team => (
                    <span key={team} className="inline-flex items-center gap-1 px-3 py-1 bg-[#fdf2f5] text-[#9f224e] rounded-full text-sm font-medium border border-[#f5d0dc]">
                      <img src={getTeamInfo(team).flag} alt={team} className="w-4 h-3 object-cover border border-gray-200" referrerPolicy="no-referrer" />
                      {getTeamInfo(team).name}
                      <button onClick={() => toggleTeam(team)} className="hover:text-red-700 ml-1 focus:outline-none"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <button 
                    onClick={() => setFavoriteTeams([])}
                    className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
              
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 border border-[#e5e5e5] rounded bg-white text-left text-sm hover:border-gray-400 transition-colors"
                >
                  <span className="text-gray-500">Thêm đội bóng...</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-[#e5e5e5] rounded shadow-lg max-h-[300px] flex flex-col">
                    <div className="p-2 border-b border-[#e5e5e5]">
                      <input 
                        type="text" 
                        placeholder="Tìm kiếm đội bóng..." 
                        className="w-full px-3 py-2 border border-[#e5e5e5] rounded text-sm focus:outline-none focus:border-[#9f224e]"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="p-1 overflow-y-auto flex-1">
                      {allTeams.filter(t => teamInfo[t].name.toLowerCase().includes(searchTerm.toLowerCase())).map(team => (
                        <label key={team} className="flex items-center px-3 py-2.5 hover:bg-[#f9f9f9] cursor-pointer rounded">
                          <div className="relative flex items-center justify-center w-4 h-4 mr-3 border border-gray-300 rounded bg-white">
                            <input 
                              type="checkbox" 
                              className="appearance-none w-full h-full cursor-pointer"
                              checked={favoriteTeams.includes(team)}
                              onChange={() => toggleTeam(team)}
                            />
                            {favoriteTeams.includes(team) && <Check className="w-3 h-3 text-[#9f224e] absolute pointer-events-none" />}
                          </div>
                          <img src={getTeamInfo(team).flag} alt={team} className="w-5 h-3.5 object-cover mr-2 border border-gray-200" referrerPolicy="no-referrer" />
                          <span className="text-sm text-[#222]">{getTeamInfo(team).name}</span>
                        </label>
                      ))}
                      {allTeams.filter(t => teamInfo[t].name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Không tìm thấy đội bóng nào
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500">
              <div className="animate-spin w-8 h-8 border-4 border-[#9f224e] border-t-transparent rounded-full mx-auto mb-4"></div>
              Đang tải dữ liệu...
            </div>
          ) : sortedKeys.length === 0 ? (
            <div className="py-20 text-center text-gray-500 border border-[#e5e5e5] rounded bg-[#f9f9f9]">
              Không có trận đấu nào phù hợp với lựa chọn của bạn.
            </div>
          ) : (
            <div className="space-y-8">
              {sortedKeys.map((key) => (
                <div key={key} className="border border-[#e5e5e5] rounded overflow-hidden">
                  <div className="bg-[#f7f7f7] px-4 py-3 border-b border-[#e5e5e5]">
                    <h2 className="text-[16px] font-bold text-[#9f224e] uppercase">
                      {viewMode === 'date' ? (key.includes('/') ? `Ngày ${key}` : key) : key}
                    </h2>
                  </div>
                  <div className="divide-y divide-[#e5e5e5]">
                    {groupedMatches[key].map(match => (
                      <div key={match.id} className="p-4 hover:bg-[#f9f9f9] transition-colors flex flex-col items-center justify-center">
                        {/* Teams and Time */}
                        <div className="flex items-center justify-center gap-3 w-full mb-2">
                          <div className="flex-1 flex items-center justify-end gap-2 text-right font-normal md:font-medium text-[15px] md:text-[16px] text-[#222]">
                            <span className="line-clamp-2 md:truncate">{getTeamInfo(match.home).name}</span>
                            <img src={getTeamInfo(match.home).flag} alt={match.home} className="w-6 h-4 object-cover border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                          </div>
                          <div className="text-[18px] md:text-[20px] font-normal text-[#222] shrink-0 w-[60px] text-center">
                            {match.datetimeHcm ? match.datetimeHcm.split(' - ')[0] : '??:??'}
                          </div>
                          <div className="flex-1 flex items-center justify-start gap-2 text-left font-normal md:font-medium text-[15px] md:text-[16px] text-[#222]">
                            <img src={getTeamInfo(match.away).flag} alt={match.away} className="w-6 h-4 object-cover border border-gray-200 shrink-0" referrerPolicy="no-referrer" />
                            <span className="line-clamp-2 md:truncate">{getTeamInfo(match.away).name}</span>
                          </div>
                        </div>
                        
                        {/* Match Info */}
                        <div className="text-[12px] md:text-[13px] text-[#757575] flex items-center justify-center gap-1.5 md:gap-2 flex-wrap text-center">
                          <span>{match.matchNum}</span>
                          <span className="text-[#ccc]">•</span>
                          {viewMode === 'date' && (
                            <>
                              <span>{match.group}</span>
                              <span className="text-[#ccc]">•</span>
                            </>
                          )}
                          <span>{match.location}</span>
                          {viewMode === 'group' && match.datetimeHcm && (
                            <>
                              <span className="text-[#ccc]">•</span>
                              <span>{match.datetimeHcm.split(' - ')[1]}</span>
                            </>
                          )}
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
