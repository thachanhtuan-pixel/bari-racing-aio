import { DiagnosticItem } from '../types';

export const DIAGNOSTIC_DATABASE: DiagnosticItem[] = [
  {
    id: 'head-valve-loose',
    location: 'Đầu bò (Cylinder Head)',
    timing: 'Máy nóng, kêu đều đặn',
    symptom: 'Tiếng gõ kim loại "tách tách" nhịp nhàng theo tua máy',
    soundKey: 'ticking',
    diagnosis: 'Lỏng cò súp-bắp (Excessive Valve Clearance)',
    dangerLevel: 'mild',
    fix: 'Tháo nắp xúp-páp canh lại khe hở nhiệt bằng thước lá (Feeler Gauge). Siết chặt ốc giữ cò.',
    specs: [
      { label: 'Khe hở nạp (IN)', value: '0.05 mm (Wave/Dream/Sirius) | 0.10 mm (Ex/Winner)' },
      { label: 'Khe hở xả (EX)', value: '0.08 mm (Wave/Dream/Sirius) | 0.16 mm (Ex/Winner)' },
      { label: 'Dụng cụ cần', value: 'Chìa khóa 9/10 canh cò, khóa t canh cò 3mm, thước lá' }
    ]
  },
  {
    id: 'head-piston-slap',
    location: 'Đầu bò (Cylinder Head)',
    timing: 'Ép ga lớn / Tải nặng',
    symptom: 'Tiếng "cọc cọc" đanh gắt, máy rung mạnh khi thốc ga',
    soundKey: 'knocking',
    diagnosis: 'Piston đụng đầu bò hoặc mắt súp-bắp (Mechanical Interference)',
    dangerLevel: 'critical',
    fix: 'NGỪNG NỔ MÁY NGAY LẬP TỨC! Tháo đầu lòng kiểm tra mặt piston và chảo xúp-páp. Chêm thêm ron chân lòng (thớt nhôm hoặc ron nhôm 0.5-1.0mm) hoặc móc sâu mắt xúp-páp.',
    specs: [
      { label: 'Biện pháp gấp', value: 'Chêm thêm 1-2 lá ron chân lòng quy-lát' },
      { label: 'Khe hở an toàn Squish', value: 'Tối thiểu 0.7mm - 0.8mm' },
      { label: 'Hậu quả nếu để chạy', value: 'Cong dập xúp-páp, bể đỉnh piston, lột nòng' }
    ]
  },
  {
    id: 'head-cam-chain',
    location: 'Đầu bò (Cylinder Head)',
    timing: 'Nổ cầm chừng (Garanti)',
    symptom: 'Tiếng sột soạt, xào xào lạch cạch bên lốc máy trái',
    soundKey: 'ticking',
    diagnosis: 'Chùng sên cam / Hỏng ty tăng cam tự động (Slack Cam Chain)',
    dangerLevel: 'moderate',
    fix: 'Kiểm tra tăng cam tự động (thay tăng cam CNC hoặc lò xo tăng cam zin). Thay sên cam DID mới nếu sợi sên đã dãn kịch kim.',
    specs: [
      { label: 'Số mắt sên cam', value: 'Wave/Dream: 84 - 90 mắt | Sirius: 86 mắt | Ex: 96 mắt' },
      { label: 'Kiểm tra bánh lồng', value: 'Kiểm tra bánh su lồng dẹp đỡ sên cam trong lòng' }
    ]
  },
  {
    id: 'head-detonation',
    location: 'Đầu bò (Cylinder Head)',
    timing: 'Kéo ga cao / Đi số lớn ở tốc độ thấp',
    symptom: 'Tiếng xè xè, rốc máy lạo xạo như có sỏi bắn trong buồng đốt',
    soundKey: 'knocking',
    diagnosis: 'Kích nổ buồng đốt do tỉ số nén (CR) quá cao hoặc thiếu xăng',
    dangerLevel: 'critical',
    fix: 'Đổi xăng sang RON 95-V hoặc pha xăng đua A98/VP. Nếu vẫn rốc, xả bớt tỉ số nén bằng cách vạt mép chảo hoặc chêm ron chân lòng dày hơn.',
    specs: [
      { label: 'Tỉ số nén CR an toàn xăng 95', value: '<= 11.2 : 1' },
      { label: 'Góc đánh lửa', value: 'Hạ bớt góc đánh lửa sớm trên ECU độ 2-3 độ' }
    ]
  },
  {
    id: 'clutch-primary-whine',
    location: 'Lốc nồi (Clutch Transmission)',
    timing: 'Chạy tua cao / Lên ga',
    symptom: 'Tiếng "húuuu" rít gió rợn người, tăng dần theo tốc độ',
    soundKey: 'whining',
    diagnosis: 'Hú cặp nhông truyền động sơ cấp (Worn Primary Drive Gears)',
    dangerLevel: 'moderate',
    fix: 'Thay trọn bộ cặp nhông hú nồi sau (bánh răng chủ động trên dên và bánh răng bị động trên chuồng heo nồi). Tuyệt đối không thay lẻ 1 cái vì sẽ tiếp tục hú.',
    specs: [
      { label: 'Giải pháp tạm thời', value: 'Thay nhớt có độ nhớt đặc hơn (10W-40 -> 20W-50)' },
      { label: 'Giải pháp triệt để', value: 'Thay cặp nhông hú zin chính hãng hoặc nhông chống hú' }
    ]
  },
  {
    id: 'clutch-slip',
    location: 'Lốc nồi (Clutch Transmission)',
    timing: 'Ép ga lớn / Tải nặng',
    symptom: 'Máy gào tua máy vọt lên nhưng xe không phóng đi, có mùi khét nhớt',
    soundKey: 'whining',
    diagnosis: 'Trượt bố nồi / Bố ba càng chai lì (Clutch Slip)',
    dangerLevel: 'moderate',
    fix: 'Thay bộ lá bố phíp + lá sắt mới. Kiểm tra mặt nhôm chuồng heo nếu bị xước sọc thì vớt lại. Với xe số tự động: dán lại bố ba càng hoặc thay cụm búa 3 càng zin.',
    specs: [
      { label: 'Lực lò xo nồi', value: 'Có thể lên 4 lò xo nồi độ tăng 15-20% độ nén' },
      { label: 'Nhớt máy khuyến nghị', value: 'Dùng nhớt đạt chuẩn JASO MA2 chuyên cho nồi ướt' }
    ]
  },
  {
    id: 'clutch-bearing-rattle',
    location: 'Lốc nồi (Clutch Transmission)',
    timing: 'Nổ cầm chừng (Garanti)',
    symptom: 'Bóp tay côn kêu rào rào, nhả tay côn thì im bặt',
    soundKey: 'ticking',
    diagnosis: 'Rơ bể bạc đạn dĩa ép ly hợp / Cao su giảm chấn chuồng heo bị chai',
    dangerLevel: 'moderate',
    fix: 'Thay bạc đạn ép nồi 6000 hoặc 6001. Đóng lại 4 hoặc 6 cục cao su tán đinh chuồng heo chống rơ.',
    specs: [
      { label: 'Mã bạc đạn ép côn', value: 'Thường là 6000/6001 của KOYO hoặc SKF' },
      { label: 'Dấu hiệu kèm theo', value: 'Vào số bị sượng cục và xe hơi chồm' }
    ]
  },
  {
    id: 'crank-rod-knock',
    location: 'Cốt dên / Bụng máy (Crankcase)',
    timing: 'Kéo ga rốc mạnh / Máy nóng',
    symptom: 'Tiếng đập "lộc cộc" nặng trịch, dội từ sâu dưới bụng lốc máy',
    soundKey: 'rodknock',
    diagnosis: 'Lột dên / Mòn rơ bạc đạn đũa ắc dên (Rod Bearing Knock)',
    dangerLevel: 'critical',
    fix: 'DỪNG XE NGAY! Lột dên sẽ làm kẹt bó máy nguy hiểm tính mạng khi đang chạy. Phải rã toàn bộ máy chẻ lốc, ép dên thay tay dên mới và rà lại lốc.',
    specs: [
      { label: 'Nguyên nhân', value: 'Cạn nhớt, nhớt giả, nghẹt bơm nhớt hoặc ép ga quá tua' },
      { label: 'Hạng mục thay', value: 'Tay dên xịn, bạc đạn đũa, ắc dên, cặp bạc đạn cốt máy SKF' }
    ]
  },
  {
    id: 'carb-bogging-low',
    location: 'Bình xăng con / Họng gió (Carburetor & Airflow)',
    timing: 'Thốc ga gấp / Nước đề ba',
    symptom: 'Tiếng "ụp... ụp" ngộp hơi rồi hụp tắt máy, xe giật cục đứng bánh',
    soundKey: 'bogging',
    diagnosis: 'Hụp ga đầu do thiếu xăng hoặc cỡ họng gió quá to làm tụt vận tốc khí (Carb Bogging)',
    dangerLevel: 'mild',
    fix: 'Tăng gíc-lơ phụ (Slow jet) lên 1-2 size (vd: 35 lên 38). Hạ phe cài kim xăng xuống 1 nấc để kim nhấc cao hơn. Vặn vít gió vào trong theo chiều kim đồng hồ.',
    specs: [
      { label: 'Khảo sát họng gió', value: 'Xe 110cc đi bình > 26mm rất dễ hụp nước đề' },
      { label: 'Căn chỉnh vít gió', value: 'Siết hết vào, sau đó xả ra đúng 1.5 đến 1.75 vòng' }
    ]
  },
  {
    id: 'exhaust-popping',
    location: 'Bình xăng con / Họng gió (Carburetor & Airflow)',
    timing: 'Thòng ga / Giảm tốc',
    symptom: 'Tiếng nổ "bụp bụp, lách tách" liên thanh phát ra ở đuôi ống pô',
    soundKey: 'ticking',
    diagnosis: 'Dư xăng thòng ga hoặc hở ron cổ pô hút gió tạo cháy dư (Exhaust Decel Pop)',
    dangerLevel: 'mild',
    fix: 'Xiết chặt lại cổ pô, thay ron đồng cổ pô mới. Nếu vẫn nổ kiểm tra hệ thống AIS xử lý khí thải hoặc hạ bớt gíc-lơ phụ 1 size.',
    specs: [
      { label: 'Điểm hở thường gặp', value: 'Ron đồng cổ pô ngay đầu bò hoặc mối nối pô slip-on' },
      { label: 'Bugi kiểm tra', value: 'Tháo bugi kiểm tra: đen muội than là dư xăng' }
    ]
  },
  {
    id: 'chain-sprocket-slack',
    location: 'Dàn chân / Khung sườn (Chassis & Drive Chain)',
    timing: 'Thốc ga gấp hoặc chạy qua dằn xóc',
    symptom: 'Tiếng đập "chát chát" vào gắp xe, xe bị giật cục khi nhấp nhả côn',
    soundKey: 'knocking',
    diagnosis: 'Sên chùng văng gắp / Nhông đĩa mòn nhọn răng / Chai cao su đùm',
    dangerLevel: 'moderate',
    fix: 'Tăng sên đúng chuẩn độ chùng 20 - 30mm. Bôi mỡ dưỡng sên chuyên dụng. Nếu nhông đĩa đã mòn vẹt sắc nhọn thì thay mới ngay để tránh đứt sên cuốn lốc máy.',
    specs: [
      { label: 'Độ võng sên chuẩn', value: '20mm - 30mm (đo tại điểm giữa gắp)' },
      { label: 'Thời gian bảo dưỡng', value: 'Sau mỗi 500km hoặc sau khi đi trời mưa lớn' }
    ]
  }
];
