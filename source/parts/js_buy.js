/* buyers for the extra crops (sample data) */
(function(){
 const add=(id,list)=>list.forEach(c=>{if(!BUY[id].crops.includes(c))BUY[id].crops.push(c);});
 add('b1',['wheat','lentil','mustard','sweetpotato']);
 add('b2',['brinjal','cauliflower','cabbage','okra','cucumber','gourd','pumpkin','carrot','radish','garlic','chili']);
 add('b3',['wheat','lentil','mustard','garlic','chili','sweetpotato']);
 add('b4',['brinjal','cauliflower','cabbage','okra','cucumber','gourd','carrot','chili','garlic','papaya','banana']);
 add('b5',['wheat']);
 BUY.b6={n:'পদ্মা পাট বাণিজ্য',type:'পাট ব্যবসায়ী',city:'ফরিদপুর',crops:['jute'],m:1.02,min:500,rate:4.3,deals:63,ver:true,pay:'নগদ, মাল ওজন করে',tp:'আপনার গুদাম থেকে আমরা তুলে নেব।'};
 BUY.b7={n:'সবুজ ফল আড়ত',type:'ফল ও সবজির আড়তদার',city:'ঢাকা',crops:['banana','papaya','pumpkin','gourd','cucumber','sweetpotato'],m:1.0,min:300,rate:4.2,deals:37,ver:true,pay:'নগদ, মাল বুঝে নিয়ে',tp:'পরিবহন ভাগাভাগি করা যায়।'};
})();
