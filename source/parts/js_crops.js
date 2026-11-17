const SOIL={loam:'দো-আঁশ',clay:'এঁটেল',sandy:'বেলে',sandyloam:'বেলে-দো-আঁশ',clayloam:'এঁটেল-দো-আঁশ',silt:'পলি',saline:'লবণাক্ত',peat:'পিট/জৈব',red:'লাল'};
const SOILL={loam:'দো-আঁশ মাটি (সবচেয়ে উপযোগী, দেশের বেশিরভাগ জমি)',clay:'এঁটেল মাটি (আঠালো, পানি ধরে রাখে)',sandy:'বেলে মাটি (বালুময়, দ্রুত শুকায়)',sandyloam:'বেলে-দো-আঁশ মাটি (বালু বেশি, নদীর পাড়/চর)',clayloam:'এঁটেল-দো-আঁশ মাটি (মাঝারি আঠালো)',silt:'পলি মাটি (নদী-বিধৌত সমভূমি, উর্বর)',saline:'লবণাক্ত মাটি (উপকূল: খুলনা, বরগুনা, কক্সবাজার)',peat:'পিট/জৈব মাটি (হাওর-বিল: সিলেট, ময়মনসিংহ, গোপালগঞ্জ)',red:'লাল মাটি (বরেন্দ্র, মধুপুর, পাহাড়ি এলাকা)'};
const SOILF={
 loam:{u:1,k:1,w:1,base:40,thr:30},clay:{u:.95,k:.9,w:.8,base:46,thr:34},sandy:{u:1.05,k:1.15,w:1.3,base:32,thr:24},
 sandyloam:{u:1.03,k:1.08,w:1.15,base:36,thr:27},clayloam:{u:.97,k:.95,w:.9,base:43,thr:32},silt:{u:1,k:.95,w:.95,base:42,thr:31},
 saline:{u:1.05,k:1,w:1.05,base:38,thr:30},peat:{u:.85,k:1.2,w:.85,base:52,thr:38},red:{u:1.05,k:1.1,w:1.2,base:30,thr:23}
};
const RISK={1:['কম','ok'],2:['মাঝারি','warn'],3:['বেশি','bad']};
const CATS=['শস্য','ডাল ও তেলবীজ','সবজি','কন্দ ও মসলা','অর্থকরী ও ফল'];
const CROPS={
 rice:{cat:0,bn:'বোরো ধান',yield:1700,cost:38000,base:28,trend:.0015,amp:.02,ph:0,days:140,store:.01,risk:1,sow:'১৫ নভেম্বর – ১৫ ডিসেম্বর (বীজতলা)',fert:{urea:105,tsp:40,mop:50,gyp:25},irr:12,suit:{loam:1,clay:1.1,sandy:.8},sal:.8,
  tips:['পর্যায়ক্রমে ভেজা-শুকনো (AWD) সেচে ২০–২৫% পানি বাঁচে','বীজতলায় পলিথিন ঢাকনা দিলে ঠান্ডার ক্ষতি কমে','ইউরিয়া ভাগ করে দিন, ভারী বৃষ্টির আগে নয়']},
 wheat:{cat:0,bn:'গম',yield:1000,cost:28000,base:44,trend:.001,amp:.015,ph:.4,days:110,store:.01,risk:1,sow:'১৫ – ৩০ নভেম্বর',fert:{urea:90,tsp:70,mop:40,gyp:55},irr:3,suit:{loam:1.05,clay:.95,sandy:.85},sal:.7,
  tips:['সময়মতো বপন করুন, দেরি হলে ফলন কমে','ব্লাস্ট-সহনশীল জাত ও শোধন করা বীজ ব্যবহার করুন','শীষ আসা ও দানা গঠনের সময় সেচ নিশ্চিত করুন']},
 maize:{cat:0,bn:'ভুট্টা',yield:3600,cost:45000,base:24,trend:.002,amp:.025,ph:2.5,days:135,store:.01,risk:1,sow:'নভেম্বর – ডিসেম্বর',fert:{urea:190,tsp:80,mop:60,gyp:40},irr:6,suit:{loam:1.05,clay:.9,sandy:.9},sal:.6,
  tips:['খরা সহনশীল হাইব্রিড জাত বেছে নিন','গোড়ায় মাটি তুলে দিলে ঝড়ে গাছ হেলে পড়ে না','মালচিং দিয়ে আর্দ্রতা ধরে রাখুন']},
 lentil:{cat:1,bn:'মসুর',yield:400,cost:15000,base:110,trend:.002,amp:.02,ph:1.5,days:100,store:.005,risk:2,sow:'নভেম্বরের মাঝামাঝি',fert:{urea:15,tsp:40,mop:25,gyp:20},irr:1,suit:{loam:1.05,clay:.9,sandy:.9},sal:.6,
  tips:['ধান কাটার পর অবশিষ্ট আর্দ্রতায় বপন করা যায়, সেচ কম লাগে','রাইজোবিয়াম জীবাণু সার দিলে মাটির নাইট্রোজেন বাড়ে','ফুল আসার সময় কুয়াশা ও আর্দ্রতায় রোগের দিকে নজর রাখুন']},
 mustard:{cat:1,bn:'সরিষা',yield:450,cost:20000,base:95,trend:.002,amp:.025,ph:2,days:90,store:.005,risk:2,sow:'অক্টোবরের শেষ – নভেম্বরের মাঝামাঝি',fert:{urea:80,tsp:60,mop:40,gyp:40},irr:2,suit:{loam:1.05,clay:.95,sandy:.85},sal:.8,
  tips:['ফুল আসার আগে একবার সেচ দিলে ফলন বাড়ে','বোরন সার ঘাটতি থাকলে ফলনে ক্ষতি হয়','জমিতে মৌমাছি রাখলে পরাগায়ন বাড়ে']},
 tomato:{cat:2,bn:'টমেটো',yield:7000,cost:95000,base:24,trend:-.006,amp:.06,ph:2,days:100,store:.15,risk:3,sow:'নভেম্বর – ডিসেম্বর (চারা রোপণ)',fert:{urea:150,tsp:110,mop:100,gyp:50},irr:8,suit:{loam:1.05,clay:.85,sandy:.9},sal:.65,
  tips:['খুঁটি ও মালচিং দিয়ে আর্দ্রতা ধরে রাখুন','ঠান্ডা রাতে চারা ঢেকে দিন','ড্রিপ সেচ ও পরিমিত সার ব্যবহার করুন']},
 brinjal:{cat:2,bn:'বেগুন',yield:9000,cost:90000,base:35,trend:.003,amp:.05,ph:.8,days:150,store:.1,risk:2,sow:'অক্টোবর – নভেম্বর (চারা রোপণ)',fert:{urea:130,tsp:100,mop:90,gyp:30},irr:8,suit:{loam:1.05,clay:.9,sandy:.85},sal:.6,
  tips:['সপ্তাহে একবার ডগা ও ফল ছিদ্রকারী পোকার আক্রান্ত অংশ কেটে ফেলুন','ফেরোমন ফাঁদ ব্যবহার করলে কীটনাশক কম লাগে','নিয়মিত ফল তুললে নতুন ফল আসে']},
 cauliflower:{cat:2,bn:'ফুলকপি',yield:8000,cost:80000,base:25,trend:-.004,amp:.06,ph:1.8,days:85,store:.12,risk:2,sow:'সেপ্টেম্বর – নভেম্বর (চারা রোপণ)',fert:{urea:120,tsp:90,mop:90,gyp:30},irr:6,suit:{loam:1.05,clay:.95,sandy:.8},sal:.55,
  tips:['ঠান্ডা আবহাওয়ার জাত সময়মতো লাগান','বোরন ঘাটতি হলে ফুল বাদামি হয়, সুষম সার দিন','কাটার পর দ্রুত ছায়ায় ও ঠান্ডা জায়গায় রাখুন']},
 cabbage:{cat:2,bn:'বাঁধাকপি',yield:12000,cost:85000,base:18,trend:-.004,amp:.06,ph:2.4,days:90,store:.1,risk:2,sow:'অক্টোবর – নভেম্বর (চারা রোপণ)',fert:{urea:140,tsp:90,mop:90,gyp:30},irr:6,suit:{loam:1.05,clay:.95,sandy:.8},sal:.55,
  tips:['নিয়মিত হালকা সেচ দিন, কপি ফেটে যাওয়া কমবে','আগাছা পরিষ্কার রাখুন ও ঘন রোপণ এড়ান','পোকার আক্রমণ দেখলে হাত দিয়ে বাছাই বা ফাঁদ ব্যবহার করুন']},
 okra:{cat:2,bn:'ঢেঁড়শ',yield:4000,cost:50000,base:35,trend:.002,amp:.05,ph:.3,days:100,store:.12,risk:2,sow:'ফেব্রুয়ারি – মার্চ',fert:{urea:100,tsp:60,mop:70,gyp:20},irr:7,suit:{loam:1.05,clay:.9,sandy:.9},sal:.6,
  tips:['হলুদ মোজাইক-সহনশীল জাত বেছে নিন','কচি ফল প্রতি ২–৩ দিন পরপর তুলুন','সাদা মাছি দমনে হলুদ আঠালো ফাঁদ কাজে লাগে']},
 cucumber:{cat:2,bn:'শসা',yield:6000,cost:55000,base:30,trend:.002,amp:.06,ph:1.1,days:70,store:.15,risk:2,sow:'ফেব্রুয়ারি – মার্চ',fert:{urea:90,tsp:70,mop:70,gyp:20},irr:8,suit:{loam:1.05,clay:.9,sandy:.9},sal:.55,
  tips:['মাচা দিলে ফল পরিষ্কার থাকে ও রোগ কমে','সকালে সেচ দিন, পাতা ভিজিয়ে রাখবেন না','ফল ছোট থাকতেই তুলে ফেলুন']},
 gourd:{cat:2,bn:'লাউ',yield:9000,cost:55000,base:20,trend:.001,amp:.05,ph:.6,days:90,store:.1,risk:1,sow:'অক্টোবর – জানুয়ারি',fert:{urea:90,tsp:60,mop:70,gyp:20},irr:6,suit:{loam:1.05,clay:.95,sandy:.85},sal:.55,
  tips:['মাচায় তুললে ফলন ও মান ভালো হয়','গোড়ায় পানি জমতে দেবেন না','কচি লাউ দ্রুত বাজারে পাঠান']},
 pumpkin:{cat:2,bn:'মিষ্টি কুমড়া',yield:8000,cost:50000,base:20,trend:.001,amp:.04,ph:.9,days:110,store:.03,risk:1,sow:'অক্টোবর – জানুয়ারি',fert:{urea:90,tsp:60,mop:70,gyp:20},irr:5,suit:{loam:1.05,clay:.95,sandy:.9},sal:.55,
  tips:['পরিপক্ক কুমড়া ঠান্ডা, শুকনো জায়গায় কিছুদিন রাখা যায়','ফুলের সময় পরাগায়নকারী পোকা বাঁচান, ভারী কীটনাশক এড়ান','পাউডারি মিলডিউ দেখলে আগে থেকে আক্রান্ত পাতা সরিয়ে নিন']},
 carrot:{cat:2,bn:'গাজর',yield:8000,cost:70000,base:30,trend:-.003,amp:.05,ph:1.4,days:90,store:.06,risk:2,sow:'অক্টোবর – নভেম্বর (সরাসরি বীজ)',fert:{urea:90,tsp:90,mop:100,gyp:30},irr:5,suit:{loam:1.1,clay:.75,sandy:1},sal:.5,
  tips:['ঝুরঝুরে, গভীর করে চাষ করা মাটিতে মান ভালো হয়','চারা পাতলা করে দিন, ঘন থাকলে গাজর বাঁকা হয়','তোলার পর ধুয়ে ছায়ায় রাখুন']},
 radish:{cat:2,bn:'মূলা',yield:10000,cost:40000,base:15,trend:-.003,amp:.05,ph:2.1,days:55,store:.08,risk:1,sow:'অক্টোবর – ডিসেম্বর (সরাসরি বীজ)',fert:{urea:70,tsp:50,mop:60,gyp:20},irr:4,suit:{loam:1.05,clay:.8,sandy:1},sal:.55,
  tips:['অল্প সময়ে ফলন আসে, তাই সময়মতো তুলুন','বেশি দেরি করলে মূলা ফাঁপা হয়','আগাছা ও সাদা মরিচা রোগের দিকে নজর রাখুন']},
 potato:{cat:3,bn:'আলু',yield:7500,cost:85000,base:22,trend:.008,amp:.03,ph:1.2,days:90,store:.02,risk:2,sow:'১৫ – ৩০ নভেম্বর',fert:{urea:100,tsp:60,mop:100,gyp:48},irr:5,suit:{loam:1.05,clay:.85,sandy:.95},sal:.55,
  tips:['উঁচু বেডে রোপণ করলে পানি নিষ্কাশন সহজ হয়','কুয়াশা ও আর্দ্র আবহাওয়ায় আগাম ছত্রাক নিয়ন্ত্রণ করুন','নালা বা ড্রিপ সেচে পানি সাশ্রয় হয়']},
 sweetpotato:{cat:3,bn:'মিষ্টি আলু',yield:6000,cost:40000,base:25,trend:.002,amp:.03,ph:.2,days:120,store:.04,risk:1,sow:'অক্টোবর – নভেম্বর (লতা রোপণ)',fert:{urea:60,tsp:40,mop:90,gyp:20},irr:3,suit:{loam:1.05,clay:.8,sandy:1.05},sal:.6,
  tips:['বেলে-দো-আঁশ মাটিতে ভালো ফলন হয়','জমিতে পানি জমতে দেবেন না','তোলার সময় আঘাত এড়ান, ক্ষত থেকে পচন বাড়ে']},
 onion:{cat:3,bn:'পেঁয়াজ',yield:4000,cost:75000,base:42,trend:.004,amp:.04,ph:.5,days:110,store:.03,risk:3,sow:'নভেম্বর – ডিসেম্বর',fert:{urea:110,tsp:60,mop:90,gyp:45},irr:7,suit:{loam:1.05,clay:.8,sandy:.95},sal:.5,
  tips:['উঁচু বেড ও ভালো নিষ্কাশন রাখুন','বৃষ্টির আগে সেচ ও স্প্রে বন্ধ রাখুন','তোলার পর ছায়াযুক্ত ঘরে শুকিয়ে সংরক্ষণ করুন']},
 garlic:{cat:3,bn:'রসুন',yield:1800,cost:90000,base:110,trend:.003,amp:.03,ph:.7,days:120,store:.02,risk:2,sow:'অক্টোবর – নভেম্বর',fert:{urea:100,tsp:90,mop:70,gyp:40},irr:5,suit:{loam:1.05,clay:.85,sandy:.9},sal:.5,
  tips:['রোগমুক্ত, বড় কোয়া বীজ হিসেবে বেছে নিন','মালচিং দিলে আগাছা ও আর্দ্রতা নিয়ন্ত্রণে থাকে','তোলার পর শুকিয়ে বাতাস চলাচলের ঘরে ঝুলিয়ে রাখুন']},
 chili:{cat:3,bn:'কাঁচা মরিচ',yield:2800,cost:80000,base:80,trend:.004,amp:.08,ph:1,days:150,store:.12,risk:3,sow:'অক্টোবর – নভেম্বর (চারা রোপণ)',fert:{urea:100,tsp:80,mop:80,gyp:30},irr:7,suit:{loam:1.05,clay:.85,sandy:.9},sal:.55,
  tips:['পাতা কোঁকড়ানো ভাইরাস ঠেকাতে সাদা মাছি দমন করুন','ফুল ও ফল আসার সময় নিয়মিত হালকা সেচ দিন','কাঁচা মরিচ দ্রুত পচে, তুলে ছায়ায় রেখে বিক্রি করুন']},
 jute:{cat:4,bn:'পাট',yield:800,cost:30000,base:57,trend:.002,amp:.02,ph:.9,days:120,store:.005,risk:2,sow:'মার্চ – এপ্রিল',fert:{urea:50,tsp:20,mop:30,gyp:20},irr:2,suit:{loam:1.05,clay:1,sandy:.8},sal:.75,
  tips:['সারি করে বীজ বুনলে নিড়ানি ও পরিচর্যা সহজ হয়','সঠিক সময়ে কেটে পরিষ্কার, স্রোতহীন পানিতে পচান','আঁশের রং ও মান ভালো রাখতে ভালোভাবে ধুয়ে শুকান']},
 banana:{cat:4,bn:'কলা',yield:10000,cost:120000,base:28,trend:.002,amp:.03,ph:1.6,days:300,store:.08,risk:2,sow:'জুন – জুলাই (চারা রোপণ)',fert:{urea:130,tsp:70,mop:150,gyp:40},irr:15,suit:{loam:1.05,clay:.9,sandy:.85},sal:.6,
  tips:['ঝড়ের ঝুঁকিতে খুঁটি দিয়ে গাছ বেঁধে দিন','শুকনো ও রোগাক্রান্ত পাতা কেটে ফেলুন','কাঁদি ঢেকে দিলে ফলের দাগ ও ক্ষতি কমে']},
 papaya:{cat:4,bn:'পেঁপে',yield:20000,cost:100000,base:25,trend:.001,amp:.04,ph:1.3,days:270,store:.1,risk:2,sow:'সেপ্টেম্বর – অক্টোবর',fert:{urea:120,tsp:80,mop:120,gyp:30},irr:12,suit:{loam:1.05,clay:.8,sandy:.9},sal:.5,
  tips:['গোড়ায় পানি জমতে দেবেন না, উঁচু বেডে লাগান','ভাইরাস আক্রান্ত গাছ তুলে ফেলুন','ফল হালকা হলুদ হলে তুলুন']}
};
(function(){/* fill suitability for the extra soil types from the three measured ones */
 const r=n=>Math.round(n*100)/100;
 Object.values(CROPS).forEach(c=>{const s=c.suit,l=s.loam;
  s.sandyloam=r((l+s.sandy)/2+.03);s.clayloam=r((l+s.clay)/2+.03);s.silt=r(l*1.03);s.peat=r(l*.9);s.saline=r(l*(c.sal||.6));s.red=r(l*.85);});
})();
const CK=Object.keys(CROPS);
const cropOpts=cur=>CATS.map((g,i)=>`<optgroup label="${g}">${CK.filter(k=>CROPS[k].cat===i).map(k=>`<option value="${k}" ${k===cur?'selected':''}>${CROPS[k].bn}</option>`).join('')}</optgroup>`).join('');
const soilOpts=cur=>Object.keys(SOIL).map(k=>`<option value="${k}" ${k===cur?'selected':''}>${SOILL[k]}</option>`).join('');
const ACT_DEF='জমি থেকে পানি বের হওয়ার নালা পরিষ্কার রাখুন এবং বৃষ্টির আগে সার বা স্প্রে দেবেন না।';
