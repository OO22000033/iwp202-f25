// كشف المحافظة من الرقم الوطني
function detectProvince(){
    var nidEl = document.getElementById("nid");
    var out = document.getElementById("province");
    if(!nidEl || !out) return;

    var nid = nidEl.value;
    if(nid.length < 2){
        out.innerText = "";
        return;
    }

    var code = nid.substring(0,2);
    var province = "";

    switch(code){
        case "01": province="دمشق"; break;
        case "02": province="ريف دمشق"; break;
        case "03": province="القنيطرة"; break;
        case "04": province="درعا"; break;
        case "05": province="السويداء"; break;
        case "06": province="حمص"; break;
        case "07": province="حماة"; break;
        case "08": province="حلب"; break;
        case "09": province="إدلب"; break;
        case "10": province="اللاذقية"; break;
        case "11": province="طرطوس"; break;
        case "12": province="دير الزور"; break;
        case "13": province="الحسكة"; break;
        case "14": province="الرقة"; break;
        default: province="غير معروفة";
    }

    out.innerText = "📍 " + province;
}

// زر المتابعة - التحقق من تحديد سيارة واحدة على الأقل
function showForm(){
    var ok = false;
    document.querySelectorAll(".car-select").forEach(chk => {
        if(chk.checked){
            ok = true;
        }
    });

    if(!ok){
        alert("❌ يرجى تحديد سيارة واحدة على الأقل بالضغط على مربع الاختيار");
        return;
    }

    var formDiv = document.getElementById("formDiv");
    if(formDiv) formDiv.style.display = "block";
}

// إظهار وإخفاء التفاصيل
function toggleDetails(id){
    var row = document.getElementById(id);
    if(row) {
        if(row.style.display === "none" || row.style.display === ""){
            row.style.display = "table-row";
        } else {
            row.style.display = "none";
        }
    }
}

// التحقق + الحساب التلقائي (مصصح وخالٍ من أخطاء التعريف)
function validateForm(){
    try {
        var nameEl = document.getElementById("name");
        var nidEl = document.getElementById("nid");
        var addressEl = document.getElementById("address");
        var provinceEl = document.getElementById("province");
        var phoneEl = document.getElementById("phone");
        var startDateEl = document.getElementById("startDate");
        var endDateEl = document.getElementById("endDate");
        var emailEl = document.getElementById("email");

        var name = nameEl ? nameEl.value.trim() : "";
        var nid = nidEl ? nidEl.value.trim() : "";
        var address = addressEl ? addressEl.value.trim() : "";
        var provinceText = provinceEl ? provinceEl.innerText : "غير محددة";
        var phone = phoneEl ? phoneEl.value.trim() : "";
        var startDateVal = startDateEl ? startDateEl.value : "";
        var endDateVal = endDateEl ? endDateEl.value : "";
        var email = emailEl ? emailEl.value.trim() : "";

        // التحقق من الاسم بالعربية 
        if (name !== "" && !/^[\p{Script=Arabic}\s]+$/u.test(name)) {
            alert("❌ الاسم غير صحيح، يجب أن يكون بالعربية أو يترك فارغاً");
            return false;
        }

        // التحقق من الرقم الوطني
        if(nid === ""){
            alert("❌ الرقم الوطني مطلوب");
            return false;
        }
        if(!/^[0-9]{11}$/.test(nid)){
            alert("❌ الرقم الوطني يجب أن يكون 11 رقماً");
            return false;
        }

        // التحقق من التواريخ
        if(startDateVal === ""){
            alert("❌ تاريخ الاستلام مطلوب");
            return false;
        }
        if(endDateVal === ""){
            alert("❌ تاريخ التسليم مطلوب");
            return false;
        }

        var start = new Date(startDateVal);
        var end = new Date(endDateVal);

        if(start >= end){
            alert("❌ تاريخ التسليم يجب أن يكون بعد تاريخ الاستلام ");
            return false;
        }

        var timeDiff = end.getTime() - start.getTime();
        var daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // تحديد شركة الاتصالات
        var operator = "غير معروفة";
        if(phone) {
            if(phone.startsWith("093") || phone.startsWith("099") || phone.startsWith("098")){
                operator = "Syriatel";
            } else if(phone.startsWith("094") || phone.startsWith("096") || phone.startsWith("095")){
                operator = "MTN";
            }
        }

        var dailyTotal = 0;
        var selectedCars = "";

        var checkedCars = document.querySelectorAll(".car-select:checked");
        
        if(checkedCars.length === 0){
            alert("❌ يرجى اختيار سيارة واحدة على الأقل.");
            return false;
        }

        checkedCars.forEach(chk => {
            var row = chk.closest("tr");
            if(row) {
                var priceEl = row.querySelector(".price");
                var priceVal = 0;
                if(priceEl && priceEl.innerText) {
                    var cleanPrice = priceEl.innerText.replace(/[^0-9]/g, '');
                    priceVal = parseInt(cleanPrice) || 0;
                }

                var nameEl = row.querySelector(".car-name") || (row.children.length > 1 ? row.children[1] : null);
                var carName = nameEl ? nameEl.innerText.trim() : "سيارة محددة";

                dailyTotal += priceVal;
                selectedCars += "\n• " + carName + " (السعر اليومي: " + priceVal.toLocaleString() + " ل.س)";
            }
        });

        var total = dailyTotal * daysCount;

        var discount = 0;
        if (daysCount > 7) {
            discount = total * 0.10;
        }
        var finalTotal = total - discount;

        alert(
            "✅ تم الطلب بنجاح\n\n" +
            "👤 الاسم: " + (name || "غير محدد") + "\n" +
            "🆔 الرقم الوطني: " + nid + "\n" +
            "📍 المحافظة: " + provinceText + "\n" +
            "🏠 العنوان: " + (address || "غير محدد") + "\n\n" +
            "📞 الموبايل: " + phone + " (" + operator + ")\n" +
            "📅 تاريخ الاستلام: " + startDateVal + "\n" + 
            "📅 تاريخ التسليم: " + endDateVal + "\n" + 
            "⏱️ عدد الأيام المحسوبة: " + daysCount + " يوم\n" + 
            "📧 الإيميل: " + (email || "غير محدد") + "\n" + 
            "🚘 السيارات المختارة:" + selectedCars + "\n\n" +
            "💰 المجموع قبل الخصم: " + total.toLocaleString() + " ل.س\n" +
            "🎁 الخصم (10%): " + discount.toLocaleString() + " ل.س\n" +
            "💵 المجموع النهائي بعد الخصم: " + finalTotal.toLocaleString() + " ل.س"
        );

        location.reload();
        return false;

    } catch (error) {
        alert("⚠️ حدث خطأ أثناء معالجة الطلب: " + error.message);
        return false;
    }
}