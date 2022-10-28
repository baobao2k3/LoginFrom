function Validator(opption){
    var selecterRudes = {};
    var formElement=document.querySelector(opption.form);

    function getParent(element, selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        }
    }

    function validate(inputElement, rule){
        var errorElement=getParent(inputElement,opption.formGroup).querySelector('.form-message');
        var erorrMessage;
        var rules=selecterRudes[rule.selecter];

        for (i=0;i<rules.length;++i){
            erorrMessage=rules[i](inputElement.value);
            if(erorrMessage) break;
      }

      if(erorrMessage){
        errorElement.innerText=erorrMessage;
       getParent(inputElement,opption.formGroup).classList.add('invalid');
      }else{
          errorElement.innerText='';
         getParent(inputElement,opption.formGroup).classList.remove('invalid');
      };
      return !erorrMessage
    }


// lặp qua từng rule và xử lí
    formElement.onsubmit=function(e){
            e.preventDefault();
            var isFormValid=true;
            opption.rules.forEach(function(rule){
                var inputElement=formElement.querySelector(rule.selecter);
                var errorElement=inputElement.parentElement.querySelector('.form-message');
                var isvalid=validate(inputElement,rule);

                if(!isvalid){
                    isFormValid=false;
                }
                
        //Kiểm tra xem có lỗi hay không
            //  if(isFormValid){
            //     console.log("có lỗi");
            //  } else{
            //     console.log("Không có lỗi")
            //  }


        //lấy ra các rule của selecter
                    var rules=selecterRudes[rule.selecter]
                    var erorrMessage;

        // Lặp qua từng rule và kiểm tra
                    for (i=0;i<rules.length;++i){
                          erorrMessage=rules[i](inputElement.value);
                          if(erorrMessage) break;
                    }

                    if(erorrMessage){
                      errorElement.innerText=erorrMessage;
                     getParent(inputElement,opption.formGroup).classList.add('invalid');
                    }else{
                        errorElement.innerText='';
                       getParent(inputElement,opption.formGroup).classList.remove('invalid');
                    };
                
                inputElement.oninput=function(){
                    errorElement.innerText='';
                   getParent(inputElement,opption.formGroup).classList.remove('invalid');
                }
            });
            
            if(isFormValid){
                var enableInputs=formElement.querySelectorAll('[name]');
                var formValue=Object.values(enableInputs);
                var newForm=formValue.reduce(function(values,input){
                    values[input.name]=input.value
                         return values;
                },{});
                opption.onSubmit(newForm)
             } else{
                alert(" Vui Lòng Nhập Đúng Thông Tin ")
             }

             
          }
    
        opption.rules.forEach(function(rule){

//  lưu lại rule chho mỗi input
             if(Array.isArray(selecterRudes[rule.selecter])){
                selecterRudes[rule.selecter].push(rule.test)
       }else{
                selecterRudes[rule.selecter]=[rule.test];

       }
            
            var inputElement=formElement.querySelector(rule.selecter);
            var errorElement=inputElement.parentElement.querySelector('.form-message')

              if(inputElement){
                inputElement.onblur=function(){

//lấy ra các rule của selecter
                    var rules=selecterRudes[rule.selecter]
                    var erorrMessage;

// Lặp qua từng rule và kiểm tra
                    for (i=0;i<rules.length;++i){
                          erorrMessage=rules[i](inputElement.value);
                          if(erorrMessage) break;
                    }

                    if(erorrMessage){
                      errorElement.innerText=erorrMessage;
                     getParent(inputElement,opption.formGroup).classList.add('invalid');
                    }else{
                        errorElement.innerText='';
                       getParent(inputElement,opption.formGroup).classList.remove('invalid');
                    };
                
                inputElement.oninput=function(){
                    errorElement.innerText='';
                   getParent(inputElement,opption.formGroup).classList.remove('invalid');

                }
                }
              }
        }
        );
    }


Validator.isRequired=function(selecter,message){
      return {
        selecter:selecter,
        test:function(value){
              return value.trim() ?undefined:message||'Vui lòng nhập trường này !'
        }
      }
}
Validator.isEmail=function(selecter){
    return {
        selecter:selecter,
        test:function(value){
            var regrex=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
            return regrex.test(value)?undefined:'Đây không phải trường email !'
        }
      }
}
Validator.isminLength=function(selecter,min){
    return {
        selecter:selecter,
        test:function(value){
            return value.length>=min?undefined:`Vui lòng nhập tối thiểu ${min} kí tự! `;
        }
      }
}
Validator.isConfimation=function(selecter,confilm,message){
    return {
        selecter:selecter,
        test:function(value){
            return value===undefined?"Không đúng định dạng !":(value===confilm()?undefined:message);
        }
      }

}