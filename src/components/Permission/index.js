import store from '@/store'
import Vue from 'vue'
const has = Vue.directive('has', {

  inserted: function(el, binding) {
    let perm = binding.value.perm;
    let rolesPerm = store.getters.roles;
    if (perm && rolesPerm) {
      if (rolesPerm.indexOf(perm) == -1) {
        let IE= isIE() ;
        if(IE){
          el.removeNode(true)
        }else{
          el.remove()
        }
      }
    }
  },
});


export function isIE() {
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  } else {
    return false;
  }
}

