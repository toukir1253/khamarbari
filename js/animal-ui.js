
(function(){
 const b=document.getElementById('animalQuickView');
 if(!b)return;
 b.addEventListener('click',function(){
   if(typeof stopTour==='function')stopTour();
   if(typeof goShot==='function')goShot(7);
   b.textContent='🐄 গরু ও ছাগলের শেড';
   const sm=document.createElement('small');sm.textContent='ছাদ সরানো দৃশ্য · ১০০ গরু · ২০০ ছাগল';b.appendChild(sm);
 });
})();
