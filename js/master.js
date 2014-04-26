// JavaScript Document
$(document).on({
  ajaxStart: function() { 
    $.mobile.loading('show');
  },
  ajaxStop: function() {
    $.mobile.loading('hide');
  }    
});
var mp = "";
var mpdg = "";
var tp = "";
var soluongphim = 0; 
var phimbatdau = 0;
var top12 = 0;
var loaive = {
	thu: "",
	mp : "",
	mlc : ""
}

var lichchieu = {
	ngaychieu: "",
	giochieu: ""
}
var thanhvien = {
	tenthanhvien : "",
	ngaysinh : "",
	cmnd : "",
	dt: "",
	diachi: "",
	gioitinh: "",
	pass: "",
	email: "",
	avatar: "",
}
//var kqdn = 0;
var thongtindatve = {
	malichchieu : "",
	maloaive : "",
	mathanhvien: "",
	soluong: 0,
	danhsachghe: [],
	dongia: ""
}
var makhuvuc = "";
$(document).ready(function(){
	
	var userid = localStorage.getItem("userid");   
	//Kiểm tra xem mã người dùng có giá trị không*
	alert("Xin " + userid);                                   
	//Nếu mã người dùng khác rỗng thì mở trang homescreen
	if(userid)
	{
		thongtindatve.mathanhvien = userid;
		$.mobile.changePage($('#homepage'),{ transition: "slide", changeHash: false });
	}
	//Ngược lại mở trang đăng nhập(khi người dùng mới đăng nhập vào hệ thống hoặc mới đăng xuất khỏi hệ thống
	else
	{
		$.mobile.changePage($('#loginpage'),{ transition: "slide", changeHash: false });
	}
	                                                 
	//Chức năng đóng ứng dụng
	$('#btnclose').click(function(){
		closes();
    });
	//Chức năng đăng xuất
	$('#btnlogouts').click(function(){
		dx();			
	});

	//Chức năng hủy đăng ký thành viên
	$("#btncancel").click(function(){
		$.mobile.changePage($('#loginpage'),{ transition: "slide", changeHash: false });
	});
	//chức năng xác nhận thông tin thành viên
	$("#btnagree").click(function(){
		$.mobile.popup($('#btnagree'), {transition: 'pop', role: 'dialog'});
	});
	//Chức năng tìm kiếm phim
	$('#lphimtk').keydown(function() {
		var kq = $(this).val();
		alert(kq);
		Danhsachtimphim(kq);
	});
	//Chức năng hiển thị danh sách phim sắp chiếu --> Thay đổi tiêu đề trang danh sách phim
	$('#tophimsc').on("click",function(){
		Tieudedanhsach("PHIM SẮP CHIẾU");
	});
	//Chức năng hiển thị danh sách phim đang chiếu --> Thay đổi tiêu đề trang danh sách phim
	$('#tophimdc').click(function(){
		Tieudedanhsach("PHIM ĐANG CHIẾU");
	});
	//Chức năng hiển thị danh sách phim hay -->  trang danh sách phim hay
	$('#tophimhay').click(function(){
		xemdsphay();
	});

	//reset phimbatdau khi thoát trang danh sách phim
	$('#listphimpage').on("pagebeforehide",function(){
		phimbatdau = 0;	
	});	
	//Hiển thị trang hồ sơ cá nhân dựa vào mã thành viên lưu trong localStorage 
	$('#userpage').on("pagebeforeshow",function(){
		gettttv(localStorage.getItem("userid"));
	});
	//Chức năng qua trang sau của trang danh sách phim
	$('#btnnext').click(function(){
		phimbatdau += 5;
		if(phimbatdau >= soluongphim){
			alert("cuối danh sách!");
			phimbatdau -= 5;
		}
		else{
			Danhsachphim(phimbatdau);
		}
	});
	//Chức năng qua trang trước của trang danh sách phim
	$('#btnback').click(function(){
		phimbatdau -= 5;
		if(phimbatdau < 0){
			alert("Đầu danh sách!");
			phimbatdau += 5;
		}
		else{
			Danhsachphim(phimbatdau);
		}
	});
//	//Mở trang xem lịch chiếu theo phim (khi đang trong trang thông tin phim)
	$('#btnxemlc').click(function(){
		$.mobile.changePage($('#lichchieuphim1page'),{ transition: "slide", changeHash: false });
	});
	//xem lịch chiếu theo phim
	$('#lichchieuphimpage').on("pagebeforeshow",function(){
		var dates = nam + "-" + mon + "-" + ngay;
		Xemlichchieuphim(dates);
	});
	
	//đánh giá phim like
	$('#btnlike').click(function(){
		danhgiaphim(1);	
	});
		//đánh giá phim dislike
	$('#btndlike').click(function(){
		danhgiaphim(0);	
	});
	//load trang số lượng vé
	$('#soluongvepage').on("pagebeforeshow",function(){
		sove(makhuvuc,thongtindatve.malichchieu);
	});
	//load trang loai vé
	$('#loaivepage').on("pagebeforeshow",function(){
		loadloaive(loaive.thu,loaive.mp,loaive.mlc);
	});
	//
	$('#chonghepage').on("pagebeforehide",function(){
		checksoghe();
	});
	//
	$('#rankphimpage').on("pagebeforeshow",function(){
		top12 = 1;
		topphim();
	});
	//
	$('#homepage').on("pagebeforeshow",function(){
		top12 = 0;
	});
	//
	$('#backthongtinphimpage').click(function(){
		if(top12 == 0){
			$.mobile.changePage($('#listphimpage'),{ transition: "slide", changeHash: false });
		}
		else{
			$.mobile.changePage($('#rankphimpage'),{ transition: "slide", changeHash: false });
		}
	});	
	//
	$('#btnlichchieu').click(function(){
		hienthingay1();
		$.mobile.changePage($('#lichchieu1page'),{ transition: "slide", changeHash: false});
	});
	//
	$('#lichchieu1page').on("pagebeforeshow",function(){
		var dates = nam + "-" + mon + "-" + ngay;
		xemlichchieu(dates);
	});
	//
	$('#thanhtoanpage').on("pagebeforeshow",function(){
		thongtinve();
	});
	//
	$('#lichchieuphim1page').on("pagebeforeshow",function(){
		hienthingay();
	});
});
	
function Danhsachtimphim(kq){
	
	$('#listphimtk').empty();
		$.ajax({
			url:"http://10.1.14.249/cinemaservice/WebServiceClient.asmx/ListPhimsearch",
			type:"GET",
			dataType:"json",
			data:{a:kq},
			success: function(msg){
				$.each(msg,function(j){ 
						$('#listphimtk').append("<li><a onclick='xemphim(\"" + msg[j].Maphim + "\");'>" + msg[j].Tenvn + "</a><span class='ui-li-count'>" + msg[j].Trangthai + "</span></li>");
				});
				$('#listphimtk').listview("refresh");
			},
			error: function(e){
				alert("lỗi" + e.status);
			}
		});
}



//đăng nhập
function dn(){
	var url ="http://10.1.14.249/cinemaservice/WebServiceClient.asmx/kttv";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{d:$('#txtusername').val(),p:$('#txtpas').val()},
		success:function(msg){
			if(msg == 1){
			localStorage.setItem("userid",$('#txtusername').val());
			thongtindatve.mathanhvien = localStorage.getItem("userid");
			$.mobile.changePage($('#homepage'),{ transition: "slide", changeHash: false });
		}
		else
			alert("Sai tài khoản");
		},
		error:function(e){
			alert(e.status);
		}
	});
}

//thông tin cá nhân
function gettttv(matv){
	$('#thongtintv').empty();
	$('#tenuser').empty();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/gettttv";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{d:matv},
		success:function(msg){
			thanhvien.tenthanhvien = msg[0].Tentv;
			thanhvien.email = msg[0].Email;
			thanhvien.cmnd = msg[0].CMND;
			thanhvien.gioitinh = msg[0].Gioitinh;
			thanhvien.ngaysinh= msg[0].Ngaysinh;
			thanhvien.dt = msg[0].DT;
			thanhvien.diachi = msg[0].Diachi;
			thanhvien.avatar = msg[0].avatar;				
		},
		error:function(e){
			alert(e.status);
		}
	}).done(function(){
	$('#dtuser').append(thanhvien.dt);
	$('#thongtintv').listview("refresh");
	});
}

//hiển thị danh sách phim hay
function xemdsphay(){
	$.mobile.changePage($('#rankphimpage'),{ transition: "slide", changeHash: false });
}




//đóng ứng dụng
function closes(){
	navigator.app.exitApp();
}

//đăng xuất
function dx(){
	localStorage.setItem("userid","");
	//$.mobile.changepage($('#loginpage'),{ transition: "slide", changeHash: false });
}

//tiêu đề danh sách phim
function Tieudedanhsach(str){
	$('#listphimpageheader').empty();
	$('#listphimpageheader').append(str);
}


function danhgiaphim(i){
	var url="http://10.1.14.249/cinemaservice/WebServiceClient.asmx/danhgiaphim";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{dg:i,mp:mpdg},
		success: function(msg){
			$('#ttp').listview("refresh");
		},
		error: function(e){
			alert("error"+e.status);
		}
	});
}

function chonloaive(thu,mphim,mlc,gc,nc){
	thongtindatve.malichchieu = mlc;
	lichchieu.ngaychieu = nc;
	lichchieu.giochieu = gc;
	loaive.mlc = mlc;
	loaive.mp = mphim;
	loaive.thu = thu;
	$.mobile.changePage($('#loaivepage'),{ transition: "slide", changeHash: false });
}

function loadloaive(thu,mphim,mlc){
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/getlistloaive";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{mphim:mphim,thu:thu},
		success:function(msg){
			$('#listloaive').empty();
			$.each(msg,function(i){
				$('#listloaive').append("<li><a onclick=\"nhapsoluongve('" + msg[i].maloaive + "','" + msg[i].makhuvuc + "','" + msg[i].dongia + "');\"><b>" + msg[i].tenloaive + "</b><span class='ui-li-count'><b class='phimtd'>" + msg[i].dongia + " VND</b></span></a></li>");
			});
			$('#listloaive').listview("refresh");
			
		},
		error: function(e){
			alert("csd" + e.status);
		}
	});
}

function nhapsoluongve(slv,kv,dg){
	makhuvuc = kv;
	thongtindatve.maloaive = slv;
	thongtindatve.dongia = dg;
	$.mobile.changePage($('#soluongvepage'),{ transition: "slide", changeHash: false });
}

function sove(makhuvuc,malichchieu){
	$('#listsoluongve').empty();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/getnumve";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{mlc:malichchieu,mkv:makhuvuc},
		success: function(msg){
			if(msg < 20){
				for( var i = 0 ; i < 20 - msg ; i ++ ){
					var j = i + 1;
					$('#listsoluongve').append("<li><a onclick=\"soluong(" + j + ");\">" + j + "&nbsp;Vé</a></li>");
				}
				$('#listsoluongve').listview("refresh");
			}
			else{
				$('#listsoluongve').append("<li>Hết Vé</li>");
			}
		},
		error: function(e){
			alert("error" + e.status);
		}
	});
}

function soluong(j){
	thongtindatve.soluong = j;
	//alert(makhuvuc);
	loadsodoghe(makhuvuc);
}

function loadsodoghe(mkv){
	$('#sodoghe1').empty();
	$('#sodoghe2').empty();
	$('#chongheheader').empty();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/sodoghe";
	$.ajax({
		url:url,
		type:"POST",
		dataType:"json",
		data:{mkv:mkv},
		success: function(msg){
			$('#chongheheader').append("<center>Khu Vực " + msg[0].tenkhuvuc + "</center>");
			for (var i = 1; i<=10 ; i ++ ){
				$('#sodoghe').append("<li><input type='checkbox' name='sttghe' id='g" + i + "' value='" + msg[i].sttghe + "'>"
                            +"<label for='g" + i + "'><center>" + msg[i].sttghe + "</center></label></li>");	
			
				var j = i + 10;
				$('#sodoghe').append("<li><input type='checkbox' name='sttghe' id='g" + j + "' value='" + msg[j].sttghe + "'>"
                            +"<label for='g" + j + "'><center>" + msg[j].sttghe + "</center></label></li>");	
			}
			checkghe(makhuvuc,thongtindatve.malichchieu);
			$.mobile.changePage($('#chonghepage'),{ transition: "slide", changeHash: false });
		},
		error: function(e){
			alert(e.status);
		}
	});
}

function checkghe(mkv,mlc){
	var url="http://10.1.14.249/cinemaservice/WebServiceClient.asmx/ghedadat";
	$.ajax({
		url: url,
		type:"POST",
		dataType:"json",
		data:{mkv:mkv,mlc:mlc},
		success: function(msg){
			var a = document.getElementsByName('sttghe');
			$.each(msg,function(i){
				for(var j = 0; j<20; j++){
					if(msg[i].sttghe === a.item(j).value){
						a.item(j).checked = true;
						a.item(j).disabled = true;
					}
				}
			});
		},
		error: function(e){
			alert(e.status);
		}
	});
}

function checksoghe(){
	var a = document.getElementsByName('sttghe');
	for(var j = 0; j<20; j++){
		if(a.item(j).checked === true){
			thongtindatve.danhsachghe.push(a.item(j).value);
		}
	}
	
	alert(thongtindatve.soluong);
}

//mở trang đăng ký
function dk(){
	$.mobile.changePage($('#registerpage'),{ transition: "slide", changeHash: false });
}

//danh sách phim hay
function topphim(){
	$('#listphimhay').empty();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/listphimhay";
	$.ajax({
		url: url,
		type:"POST",
		dataType:"json",
		success: function(msg){
			$.each(msg,function(i){
				$('#listphimhay').append("<li><a  onclick='xemphim(\"" + msg[i].Maphim + "\");'><h3>" + msg[i].Tenvn + "</h3></a><span class='ui-li-count'>" + Math.round(msg[i].Danhgia) + "%</span></li>");
			});
			$('#listphimhay').listview("refresh");
		},
		error: function(e){
			alert(e.status());
		}
	});
}
//xem lịch chiếu
var mplc = [];
var tplc = [];
var lplc = [];


function thongtinve(){
	$('#thanhtoanheader').empty();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/thongtinve";
	$.ajax({
		url: url,
		type:"POST",
		dataType:"json",
		data: 
		{
			lc: thongtindatve.malichchieu,
			tv: thongtindatve.mathanhvien,
			lv: thongtindatve.maloaive
		},
		success: function(msg){
			$('#thanhtoanheader').append(msg[0].tentv);
			$('#thanhtoandongia').empty();
			$('#thanhtoandongia').append(thongtindatve.dongia);
			$('#thanhtoandsghe').empty();
			$('#thanhtoandsghe').append(thongtindatve.danhsachghe);
			$('#thanhtoangiochieu').empty();
			$('#thanhtoangiochieu').append(lichchieu.giochieu);
			$('#thanhtoanngaychieu').empty();
			$('#thanhtoanngaychieu').append(lichchieu.ngaychieu);
			$('#thanhtoanloaiphim').empty();
			$('#thanhtoanloaiphim').append(msg[0].lp);
			$('#thanhtoansoluong').empty();
			$('#thanhtoansoluong').append(thongtindatve.soluong);
			$('#thanhtoanthanhtien').empty();
			$('#thanhtoanthanhtien').append(thongtindatve.soluong*thongtindatve.dongia);
			$('#thanhtoantenphim').empty();
			$('#thanhtoantenphim').append(msg[0].tenphim);
		},
		error: function(e){
			alert(e.status());
		}
	});
}

var now = new Date();
var ngay1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
var ngay2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
var ngay3 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
var ngay4 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4);
var ngay5 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5);
var ngay6 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);

function hienthingay(){
		switch (now.getDay()){
		case 0: $('#ngay0').append("Chủ Nhật, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());			break;
		case 1: $('#ngay0').append("Thứ Hai, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
		case 2: $('#ngay0').append("Thứ Ba, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
		case 3: $('#ngay0').append("Thứ Tư, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
		case 4: $('#ngay0').append("Thứ Năm, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
		case 5: $('#ngay0').append("Thứ Sáu, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
		case 6: $('#ngay0').append("Thứ Bảy, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear());				break;
	}
	switch (ngay1.getDay()){
		case 0: 
			$('#ngay1').append("Chủ Nhật, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());
			break;
		case 1: $('#ngay1').append("Thứ Hai, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
		case 2: $('#ngay1').append("Thứ Ba, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
		case 3: $('#ngay1').append("Thứ Tư, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
		case 4: $('#ngay1').append("Thứ Năm, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
		case 5: $('#ngay1').append("Thứ Sáu, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
		case 6: $('#ngay1').append("Thứ Bảy, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear());				break;
	}
	switch (ngay2.getDay()){
		case 0: $('#ngay2').append("Chủ Nhật, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());
				break;
		case 1: $('#ngay2').append("Thứ Hai, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
		case 2: $('#ngay2').append("Thứ Ba, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
		case 3: $('#ngay2').append("Thứ Tư, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
		case 4: $('#ngay2').append("Thứ Năm, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
		case 5: $('#ngay2').append("Thứ Sáu, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
		case 6: $('#ngay2').append("Thứ Bảy, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear());				break;
	}
	switch (ngay3.getDay()){
		case 0: $('#ngay3').append("Chủ Nhật, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 1: $('#ngay3').append("Thứ Hai, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 2: $('#ngay3').append("Thứ Ba, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 3: $('#ngay3').append("Thứ Tư, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 4: $('#ngay3').append("Thứ Năm, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 5: $('#ngay3').append("Thứ Sáu, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
		case 6: $('#ngay3').append("Thứ Bảy, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear());				break;
	}
	switch (ngay4.getDay()){
		case 0: $('#ngay4').append("Chủ Nhật, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 1: $('#ngay4').append("Thứ Hai, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 2: $('#ngay4').append("Thứ Ba, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 3: $('#ngay4').append("Thứ Tư, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 4: $('#ngay4').append("Thứ Năm, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 5: $('#ngay4').append("Thứ Sáu, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
		case 6: $('#ngay4').append("Thứ Bảy, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear());				break;
	}
	switch (ngay5.getDay()){
		case 0: $('#ngay5').append("Chủ Nhật, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 1: $('#ngay5').append("Thứ Hai, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 2: $('#ngay5').append("Thứ Ba, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 3: $('#ngay5').append("Thứ Tư, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 4: $('#ngay5').append("Thứ Năm, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 5: $('#ngay5').append("Thứ Sáu, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
		case 6: $('#ngay5').append("Thứ Bảy, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear());				break;
	}
	switch (ngay6.getDay()){
		case 0: $('#ngay6').append("Chủ Nhật, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 1: $('#ngay6').append("Thứ Hai, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 2: $('#ngay6').append("Thứ Ba, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 3: $('#ngay6').append("Thứ Tư, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 4: $('#ngay6').append("Thứ Năm, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 5: $('#ngay6').append("Thứ Sáu, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
		case 6: $('#ngay6').append("Thứ Bảy, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear());				break;
	}
}



function xemgio(i){
	
	switch(i){
		case 0: Xemlichchieuphim(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate());break;
		case 1: Xemlichchieuphim(ngay1.getFullYear() + "-" + (ngay1.getMonth()+1) + "-" + ngay1.getDate());break;
		case 2:	Xemlichchieuphim(ngay2.getFullYear() + "-" + (ngay2.getMonth()+1) + "-" + ngay2.getDate());break;
		case 3: Xemlichchieuphim(ngay3.getFullYear() + "-" + (ngay3.getMonth()+1) + "-" + ngay3.getDate());break;
		case 4: Xemlichchieuphim(ngay4.getFullYear() + "-" + (ngay4.getMonth()+1) + "-" + ngay4.getDate());break;
		case 5: Xemlichchieuphim(ngay5.getFullYear() + "-" + (ngay5.getMonth()+1) + "-" + ngay5.getDate());break;
		case 6: Xemlichchieuphim(ngay6.getFullYear() + "-" + (ngay6.getMonth()+1) + "-" + ngay6.getDate());break;
	}
}

function Xemlichchieuphim(dates){
	$.mobile.changePage($('#lichchieuphimpage'),{transition:"slide", changeHash: false });
	$('#lcphim1header').empty();
	$('#lcphim1header').append(dates);
		var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/getlc";
		$.ajax({
			url:url,
			type:"POST",
			dataType:"json",
			data:{mp:mpdg,ngayc:dates},
			success: function(msg){
				//alert(date.getDay());
				$('#lctp').empty();
				$.each(msg,function(i){
					if(th == 0 || th == 6 || th == 5){
						$('#lctp').append("<li><a onclick=\"chonloaive('cuoituan','" + msg[i].maphim + "','" + msg[i].malc + "','" + msg[i].giochieu + "','" + dates + "');\"><b>" + msg[i].giochieu + "</b></a></li>");
					}
					else{
						$('#lctp').append("<li><a onclick=\"chonloaive('thuong','" + msg[i].maphim + "','" + msg[i].malc + "','" + msg[i].giochieu + "','" + dates + "');\"><b>" + msg[i].giochieu + "</b></a></li>");
					}
				});
				$('#lctp').listview("refresh");
			},
			error: function(e){
				alert("cjv" + e.status);
			}			
		});
}


function hienthingay1(){
		switch (now.getDay()){
		case 0: $('#ngay10').append("Chủ Nhật, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 1: $('#ngay10').append("Thứ Hai, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 2: $('#ngay10').append("Thứ Ba, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 3: $('#ngay10').append("Thứ Tư, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 4: $('#ngay10').append("Thứ Năm, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 5: $('#ngay10').append("Thứ Sáu, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
		case 6: $('#ngay10').append("Thứ Bảy, " + now.getDate() + " Tháng " + (now.getMonth()+1) + " Năm " + now.getFullYear())			;				break;
	}
	switch (ngay1.getDay()){
		case 0: $('#ngay11').append("Chủ Nhật, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 1: $('#ngay11').append("Thứ Hai, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 2: $('#ngay11').append("Thứ Ba, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 3: $('#ngay11').append("Thứ Tư, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 4: $('#ngay11').append("Thứ Năm, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 5: $('#ngay11').append("Thứ Sáu, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
		case 6: $('#ngay11').append("Thứ Bảy, " + ngay1.getDate() + " Tháng " + (ngay1.getMonth()+1) + " Năm " + ngay1.getFullYear())			;				break;
	}
	switch (ngay2.getDay()){
		case 0: $('#ngay12').append("Chủ Nhật, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 1: $('#ngay12').append("Thứ Hai, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 2: $('#ngay12').append("Thứ Ba, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 3: $('#ngay12').append("Thứ Tư, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 4: $('#ngay12').append("Thứ Năm, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 5: $('#ngay12').append("Thứ Sáu, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
		case 6: $('#ngay12').append("Thứ Bảy, " + ngay2.getDate() + " Tháng " + (ngay2.getMonth()+1) + " Năm " + ngay2.getFullYear())			;				break;
	}
	switch (ngay3.getDay()){
		case 0: $('#ngay13').append("Chủ Nhật, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 1: $('#ngay13').append("Thứ Hai, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 2: $('#ngay13').append("Thứ Ba, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 3: $('#ngay13').append("Thứ Tư, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 4: $('#ngay13').append("Thứ Năm, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 5: $('#ngay13').append("Thứ Sáu, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
		case 6: $('#ngay13').append("Thứ Bảy, " + ngay3.getDate() + " Tháng " + (ngay3.getMonth()+1) + " Năm " + ngay3.getFullYear())			;				break;
	}
	switch (ngay4.getDay()){
		case 0: $('#ngay14').append("Chủ Nhật, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 1: $('#ngay14').append("Thứ Hai, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 2: $('#ngay14').append("Thứ Ba, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 3: $('#ngay14').append("Thứ Tư, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 4: $('#ngay14').append("Thứ Năm, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 5: $('#ngay14').append("Thứ Sáu, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
		case 6: $('#ngay14').append("Thứ Bảy, " + ngay4.getDate() + " Tháng " + (ngay4.getMonth()+1) + " Năm " + ngay4.getFullYear())			;				break;
	}
	switch (ngay5.getDay()){
		case 0: $('#ngay15').append("Chủ Nhật, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 1: $('#ngay15').append("Thứ Hai, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 2: $('#ngay15').append("Thứ Ba, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 3: $('#ngay15').append("Thứ Tư, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 4: $('#ngay15').append("Thứ Năm, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 5: $('#ngay15').append("Thứ Sáu, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
		case 6: $('#ngay15').append("Thứ Bảy, " + ngay5.getDate() + " Tháng " + (ngay5.getMonth()+1) + " Năm " + ngay5.getFullYear())			;				break;
	}
	switch (ngay6.getDay()){
		case 0: $('#ngay16').append("Chủ Nhật, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 1: $('#ngay16').append("Thứ Hai, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 2: $('#ngay16').append("Thứ Ba, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 3: $('#ngay16').append("Thứ Tư, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 4: $('#ngay16').append("Thứ Năm, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 5: $('#ngay16').append("Thứ Sáu, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
		case 6: $('#ngay16').append("Thứ Bảy, " + ngay6.getDate() + " Tháng " + (ngay6.getMonth()+1) + " Năm " + ngay6.getFullYear())			;				break;
	}
}

function xemgio1(i){
	
	switch(i){
		case 0: Xemlichchieu(now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate());break;
		case 1: Xemlichchieu(ngay1.getFullYear() + "-" + (ngay1.getMonth()+1) + "-" + ngay1.getDate());break;
		case 2:	Xemlichchieu(ngay2.getFullYear() + "-" + (ngay2.getMonth()+1) + "-" + ngay2.getDate());break;
		case 3: Xemlichchieu(ngay3.getFullYear() + "-" + (ngay3.getMonth()+1) + "-" + ngay3.getDate());break;
		case 4: Xemlichchieu(ngay4.getFullYear() + "-" + (ngay4.getMonth()+1) + "-" + ngay4.getDate());break;
		case 5: Xemlichchieu(ngay5.getFullYear() + "-" + (ngay5.getMonth()+1) + "-" + ngay5.getDate());break;
		case 6: Xemlichchieu(ngay6.getFullYear() + "-" + (ngay6.getMonth()+1) + "-" + ngay6.getDate());break;
	}
}

function xemlichchieu(dates){
	$('#lichchieu').empty();
	$('#lichchieuheader').empty();
	$('#lichchieuheader').append(dates);
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/getlcn";
	$.ajax({
		url: url,
		type:"POST",
		dataType:"json",
		data:{ngayc:dates},
		success: function(msg){
			$.each(msg,function(i){
				var xl = 0;
				for(var x = 0; x < mplc.length; x++){
					if(msg[i].maphim == mplc[x].toString()){
						break;
					}
					xl++;
				}
				if(xl == mplc.length){
					lplc.push(msg[i].malp);
					tplc.push(msg[i].tenphim);
					mplc.push(msg[i].maphim);
				}
			});
			for(var x = 0; x < mplc.length; x++){
				$('#lichchieu').append("<li data-role='list-divider'>" + tplc[x].toString() + "<span class='ui-li-count'>" + lplc[x].toString() + "</span></li>");
				$.each(msg,function(i){
					if(msg[i].maphim == mplc[x].toString()){
						if(th == 0 || th == 6 || th ==5){
						$('#lichchieu').append("<li><a onclick=\"chonloaive('cuoituan','" + msg[i].maphim + "','" + msg[i].malc + "','" + msg[i].giochieu + "','" + dates + "');\">" + msg[i].giochieu + "</a></li>");
						}
						else{
							$('#lichchieu').append("<li><a onclick=\"chonloaive('thuong','" + msg[i].maphim + "','" + msg[i].malc + "','" + msg[i].giochieu + "','" + dates + "');\">" + msg[i].giochieu + "</a></li>");
						}
					}
				});
			}
			$('#lichchieu').listview("refresh");
		},
		error: function(e){
			alert(e.status());
		}
	});
}

function Danhsachphim(s){
	$('#listphim').empty();
	var td = "";
	td = $('#listphimpageheader').text();
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/ListPhim";
	if(td == "PHIM SẮP CHIẾU"){
		$.ajax({
			url:url,
			type:"POST",
			dataType:"json",
			data:{
				i:JSON.stringify(s),
				a:JSON.stringify("SC")			
			},
			success:function(msg){
				soluongphim = msg[1];
				$('#listphim').empty();
				if(soluongphim > 0){
					$.each(msg[0],function(j){
						var b = msg[0][j].Dotuoi;
						var a = msg[0][j].LP;
						if(b != 0){
							$('#listphim').append("<li><img src='http://10.1.14.249/cinemaservice/img/abc.png'/><a  onclick='xemphim(\"" + msg[0][j].Maphim + "\");'><h3><b class='phimtd'>" + msg[0][j].Tenvn.toUpperCase() + "</b> &nbsp; " + msg[0][j].Dotuoi + "+</h3><p><b>Năm Sản Xuất: </b>" + msg[0][j].Namsx + "</p><p><b>Thể Loại: </b>" + msg[0][j].Theloai + "</p></a><span class='ui-li-count'><b class='phimtd'>" + a + "</b></span></li>");
						}
						else{
							$('#listphim').append("<li><img src='http://10.1.14.249/cinemaservice/img/abc.png'/><a  onclick='xemphim(\"" + msg[0][j].Maphim + "\");'><h3><b class='phimtd'>" + msg[0][j].Tenvn.toUpperCase() + "</b></h3><p><b>Năm Sản Xuất: </b>" + msg[0][j].Namsx + "</p><p><b>Thể Loại: </b>" + msg[0][j].Theloai + "</p></a><span class='ui-li-count'><b class='phimtd'>" + a + "</b></span></li>");
						}
					});
				}
				else{
					$('#listphim').append("<li>Chưa Cập Nhật</li>");		
				}
				$('#listphim').listview("refresh");
			},
			error: function(e){
				alert("csd" + e.status);
			}
		});
	}
	else{
		$.ajax({
			url:url,
			type:"POST",
			dataType:"json",
			data:{
				i:JSON.stringify(s),
				a:JSON.stringify("DC")			
			},
			success:function(msg){
				soluongphim = msg[1];
				$('#listphim').empty();
				if(soluongphim > 0){
					$.each(msg[0],function(j){
						var b = msg[0][j].Dotuoi;
						var a = msg[0][j].LP;
						if(b != 0){
							$('#listphim').append("<li><a  onclick='xemphim(\"" + msg[0][j].Maphim + "\");'><img src='http://10.1.14.249/cinemaservice/img/" + msg[0][j].Poster + ".png'/><h3><b class='phimtd'>" + msg[0][j].Tenvn.toUpperCase() + "</b> &nbsp; " + msg[0][j].Dotuoi + "+</h3><p><b>" + msg[0][j].Theloai + "</b></p></a><span class='ui-li-count'><b class='phimtd'>" + a + "</b></span></li>");
						}
						else{
							$('#listphim').append("<li><a  onclick='xemphim(\"" + msg[0][j].Maphim + "\");'><img src='http://10.1.14.249/cinemaservice/img/"+msg[0][j].Poster+".png'/><h3><b class='phimtd'>" + msg[0][j].Tenvn.toUpperCase() + "</b></h3><p><b>" + msg[0][j].Theloai + "</b></p></a><span class='ui-li-count'><b class='phimtd'>" + a + "</b></span></li>");
						}
					});
				}
				else{
					$('#listphim').append("<li>Chưa Cập Nhật</li>");		
				}
				$('#listphim').listview("refresh");
			},
			error: function(e){
				alert("csd" + e.status);
			}
		});
	}
	$.mobile.changePage($('#listphimpage'),{ transition: "slide", changeHash: false });
}



function xemphim(mp){
	mpdg = mp;
	var url = "http://10.1.14.249/cinemaservice/WebServiceClient.asmx/ttPhim";
			$.ajax({
				url:url,
				type:"POST",
				dataType:"json",
				data:{maphim:JSON.stringify(mp)},
				async:false,
				beforeSend: function(){
					
				},
				success:function(msg){
					tp = msg[0].tvn;
					$('#phimheader').empty();
				    $('#phimheader').append(tp.toUpperCase());
					$('#phimteng').empty();
					$('#phimlp').empty();
					$('#phimlp').append(" " + msg[0].tlp);
					$('#phimteng').append(" " + msg[0].teng);
					$('#lcphimheader').empty();
				    $('#lcphimheader').append(msg[0].tvn.toUpperCase());
					$('#phimgt').empty();
					$('#phimgt').append(" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + msg[0].gt);
					$('#phimdd').empty();
					$('#phimdd').append(" " + msg[0].tdd);
					$('#phimngongu').empty();
					$('#phimngongu').append(" " + msg[0].nn);
					$('#phimngaykc').empty();
					$('#phimngaykc').append(" " + msg[0].nkc);
					$('#phimtl').empty();
					$.each(msg[1].TTL,function(i){
						if(msg[1].TTL[i+1] ==null)
							$('#phimtl').append(msg[1].TTL[i]);
						else
							$('#phimtl').append(msg[1].TTL[i]+", ");	
					});
					
					$('#phimdv').empty();
					$.each(msg[2].DDV,function(i){
						if(msg[2].DDV[i+1] ==null)
							$('#phimdv').append(msg[2].DDV[i]);
						else
							$('#phimdv').append(msg[2].DDV[i]+", ");	
					});
					//$('#phimdv').append(" " + msg[2].DDV);
					//$('#phimdv').append("<u>Diễn viên</u>:" + msg[2].DDV);
					//$('#phimdv').append(msg[1].TTL);
					$('#phimquocgia').empty();
					$('#phimquocgia').append(" " + msg[0].tqg);
					$('#phimnamsx').empty();
					$('#phimnamsx').append(" " + msg[0].nsx);
					$('#phimdanhgia').empty();
					if(msg[4].lks > -1)
						$('#phimdanhgia').append(" " + Math.round(msg[4].dlks*100 / (msg[4].lks + msg[4].dlks)) + "% Người Thích");
					else
						$('#phimdanhgia').append("Phim Chưa Được Đánh Giá");	
					$('#phimdotuoi').empty();
					if(msg[0].ghdt == 18)
					{
						$('#phimdotuoi').append("<marquee><font color='#FF0000'>Phim không dành cho trẻ em dưới 18 tuổi</font></marquee>");
					}
					else if(msg[0].ghdt == 16)
					{
						$('#phimdotuoi').append("<marquee><font color='#FF0000'>Phim không dành cho trẻ em dưới 16 tuổi</font></marquee>");
					}
					else if(msg[0].ghdt == 13)
					{
						$('#phimdotuoi').append("<marquee><font color='#FF0000'>Phim không dành cho trẻ em dưới 13 tuổi</font></marquee>");
					}
					else
					{
						$('#phimdotuoi').append("<marquee><font color='#FF0000'>Phim không giới hạn độ tuổi</font></marquee>");
					}
					$('#posterphim').empty();
					$.each(msg[3].PTT,function(j){
						$('#posterphim').append("<p><img width='100%' src='http://10.1.14.249/cinemaservice/img/" + msg[3].PTT[j] + ".png'></p>");
					});
 					
					//$('#ttp').listview("refresh");
					$.mobile.changePage($('#thongtinphimpage'),{ transition: "slide", changeHash: false });
				},
				error: function(e){
					alert("csd" + e.status);
				}
			});
}
