(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{NLKW:function(t,i,e){"use strict";e.r(i),e.d(i,"ProductFormPageModule",function(){return I});var o=e("ofXK"),n=e("3Pt+"),s=e("TEn/"),r=e("tyNb"),c=e("mrSG"),a=e("OGMK"),u=e("PVVB"),l=e("BTSn"),d=e("fXoL"),b=e("3LUQ"),h=e("Gdn9"),p=e("mnRn"),g=e("2MiI");function f(t,i){if(1&t){const t=d.Sb();d.Rb(0,"ion-slide"),d.Rb(1,"img",18),d.Zb("click",function(){d.mc(t);const e=i.index;return d.bc().ChancePhoto(e)}),d.Qb(),d.Qb()}if(2&t){const t=i.$implicit;d.Bb(1),d.gc("src",t,d.nc)}}function m(t,i){if(1&t&&(d.Pb(0),d.Rb(1,"ion-select-option",19),d.qc(2),d.Qb(),d.Ob()),2&t){const t=i.$implicit;d.Bb(1),d.gc("value",t.category),d.Bb(1),d.rc(t.title)}}function v(t,i){if(1&t&&(d.Pb(0),d.Rb(1,"ion-select-option",19),d.qc(2),d.Qb(),d.Ob()),2&t){const t=i.$implicit;d.Bb(1),d.gc("value",t.value),d.Bb(1),d.rc(t.title)}}function y(t,i){if(1&t){const t=d.Sb();d.Rb(0,"ion-item"),d.Rb(1,"ion-label"),d.qc(2,"Sub Categoria"),d.Qb(),d.Rb(3,"ion-select",20),d.Zb("ngModelChange",function(i){return d.mc(t),d.bc().subCategoryValue=i})("ngModelChange",function(i){return d.mc(t),d.bc().SubCatChange(i)}),d.pc(4,v,3,2,"ng-container",7),d.Qb(),d.Qb()}if(2&t){const t=d.bc();d.Bb(3),d.gc("ngModel",t.subCategoryValue),d.Bb(1),d.gc("ngForOf",t.subCats)}}function C(t,i){1&t&&(d.Rb(0,"span"),d.qc(1,"Atualizar"),d.Qb())}function S(t,i){1&t&&(d.Rb(0,"span"),d.qc(1,"Registrar"),d.Qb())}const M=function(t){return{webrowser:t}},P={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0},R=[{path:"",component:(()=>{class t{constructor(t,i,e,o,n,s){this.router=t,this.activatedRoute=i,this.alertService=e,this.productService=o,this.imageService=n,this.navController=s,this.title="Formul\xe1rio de Produto",this.slideOpts=P,this.product=new l.a,this.user=null,this.cats=u.a.Categories(),this.categoryValue=null,this.subCategoryValue=null}ngOnInit(){}ionViewWillEnter(){this.checkForUserAndProduct(),this.GetPlataformInfo()}ionViewWillLeave(){this.user=null,this.product=new l.a,this.categoryValue=null,this.subCategoryValue=null,this.subscription1&&!this.subscription1.closed&&this.subscription1.unsubscribe(),this.subscription2&&!this.subscription2.closed&&this.subscription2.unsubscribe(),this.subscription3&&!this.subscription3.closed&&this.subscription3.unsubscribe()}GetPlataformInfo(){this.subscription1&&!this.subscription1.closed&&this.subscription1.unsubscribe(),this.subscription1=a.a.GetAppInfo().subscribe(t=>{this.isMobile=t.appWidth<=a.a.maxMobileWidth,this.setDivWidth(.4*t.appWidth>a.a.maxMobileWidth/1.5?"40%":a.a.maxMobileWidth/1.5+"px")})}setDivWidth(t){document.body.style.setProperty("--maxWidth",t)}checkForUserAndProduct(){return Object(c.b)(this,void 0,void 0,function*(){yield this.alertService.presentLoading().then(t=>this.loadingPopupID=t),this.subscription2&&!this.subscription2.closed&&this.subscription2.unsubscribe(),this.subscription2=a.a.GetUserInfo().subscribe(t=>Object(c.b)(this,void 0,void 0,function*(){if(!t)return yield this.router.navigate(["/"]),void(yield this.alertService.dismissLoading(this.loadingPopupID));this.user=t,yield this.checkForProduct()}))})}checkForProduct(){return Object(c.b)(this,void 0,void 0,function*(){var t=!0;for(this.product.id=this.activatedRoute.snapshot.paramMap.get("id"),this.product.id?(this.subscription3&&!this.subscription3.closed&&this.subscription3.unsubscribe(),this.subscription3=(yield this.productService.Get(this.product.id)).subscribe(i=>Object(c.b)(this,void 0,void 0,function*(){if(i.sellerID!=this.user.id)return yield this.alertService.dismissLoading(this.loadingPopupID),void(yield this.router.navigate(["/"]));var e=new l.a;this.product=Object.assign(Object.assign({},i),{fillSubCategory:e.fillSubCategory,calculateAvgRating:e.calculateAvgRating,id:this.product.id}),this.categoryValue=u.a.GetSubCatFromValue(this.product.subCatValue).category,this.subCats=u.a.GetSubCatFrom(this.categoryValue),this.subCategoryValue=this.product.subCatValue,t=!1}))):(this.product.sellerID=this.user.id,t=!1);t;)yield new Promise(t=>setTimeout(t,10));yield this.alertService.dismissLoading(this.loadingPopupID)})}OnClick(t){return Object(c.b)(this,void 0,void 0,function*(){t.valid&&(yield this.alertService.presentLoading().then(t=>this.loadingPopupID=t),this.product.id?this.productService.Update(this.product,this.product.id).then(t=>Object(c.b)(this,void 0,void 0,function*(){yield this.successfulSubmit("Aten\xe7\xe3o","Produto foi atualizado!","/product/"+this.product.id)}),t=>Object(c.b)(this,void 0,void 0,function*(){console.error(t),yield this.failedSubmit("Error","Produto n\xe3o foi atualizado!")})):yield this.productService.Add(this.product).then(i=>Object(c.b)(this,void 0,void 0,function*(){yield t.reset(),yield this.successfulSubmit("Aten\xe7\xe3o","Produto registrado!",`/product/${i.id}`)}),t=>Object(c.b)(this,void 0,void 0,function*(){console.error(t),yield this.failedSubmit("Erro","Produto n\xe3o registrado!")})))})}successfulSubmit(t,i,e){return Object(c.b)(this,void 0,void 0,function*(){yield this.alertService.dismissLoading(this.loadingPopupID),yield this.alertService.presentAlert(t,i),yield this.router.navigate([e])})}failedSubmit(t,i){return Object(c.b)(this,void 0,void 0,function*(){yield this.alertService.dismissLoading(this.loadingPopupID),yield this.alertService.presentAlert(t,i)})}NewPhoto(){return Object(c.b)(this,void 0,void 0,function*(){this.product.gallery||(this.product.gallery=[]),yield this.imageService.getImage(80).then(t=>Object(c.b)(this,void 0,void 0,function*(){yield this.alertService.presentLoading().then(t=>this.loadingPopupID=t),t&&this.product.gallery.push(t),yield this.alertService.dismissLoading(this.loadingPopupID)}))})}ChancePhoto(t){return Object(c.b)(this,void 0,void 0,function*(){yield this.imageService.getImageWithDelete().then(i=>Object(c.b)(this,void 0,void 0,function*(){yield this.alertService.presentLoading().then(t=>this.loadingPopupID=t),i&&(i.delete?this.product.gallery.splice(t,1):this.product.gallery[t]=i.image),yield this.alertService.dismissLoading(this.loadingPopupID)}))})}CatChange(t){this.subCats=u.a.GetSubCatFrom(this.categoryValue),this.subCategoryValue=null}SubCatChange(t){this.product.subCatValue=this.subCategoryValue,this.product.fillSubCategory()}GoBack(){this.navController.back()}}return t.\u0275fac=function(i){return new(i||t)(d.Mb(r.g),d.Mb(r.a),d.Mb(b.a),d.Mb(h.a),d.Mb(p.a),d.Mb(s.X))},t.\u0275cmp=d.Gb({type:t,selectors:[["app-product-form"]],decls:37,vars:18,consts:[["segment","0",3,"title"],[3,"fullscreen"],["segment","1",3,"title"],[3,"ngClass"],[3,"ngSubmit"],["form","ngForm"],["pager","true",3,"options"],[4,"ngFor","ngForOf"],["src","assets/NewPhoto.png",3,"click"],["position","floating"],["type","text","name","prod-name","required","","clearInput","","pattern","[*-_0-9a-zA-Z'& ]*",3,"ngModel","ngModelChange"],["type","number","name","prod-price","required","","clearInput","",3,"ngModel","ngModelChange"],["name","prod-category","interface","popover","placeholder","Select One","required","",3,"ngModel","ngModelChange"],[4,"ngIf"],["name","prod-description","autoGrow","true",3,"ngModel","ngModelChange"],["type","number","name","prod-stock","value","0","clearInput","",3,"ngModel","ngModelChange"],["expand","block","size","medium","type","submit",1,"ion-margin",3,"disabled"],["expand","block","size","default","type","reset",1,"ion-margin",3,"click"],[3,"src","click"],[3,"value"],["name","prod-subCategory","interface","popover","placeholder","Select One","required","",3,"ngModel","ngModelChange"]],template:function(t,i){if(1&t){const t=d.Sb();d.Nb(0,"app-header",0),d.Rb(1,"ion-content",1),d.Nb(2,"app-header",2),d.Rb(3,"div",3),d.Rb(4,"form",4,5),d.Zb("ngSubmit",function(){d.mc(t);const e=d.lc(5);return i.OnClick(e)}),d.Rb(6,"ion-slides",6),d.pc(7,f,2,1,"ion-slide",7),d.Rb(8,"ion-slide"),d.Rb(9,"img",8),d.Zb("click",function(){return i.NewPhoto()}),d.Qb(),d.Qb(),d.Qb(),d.Rb(10,"ion-item"),d.Rb(11,"ion-label",9),d.qc(12,"Nome"),d.Qb(),d.Rb(13,"ion-input",10),d.Zb("ngModelChange",function(t){return i.product.name=t}),d.Qb(),d.Qb(),d.Rb(14,"ion-item"),d.Rb(15,"ion-label"),d.qc(16,"Pre\xe7o "),d.Qb(),d.Rb(17,"ion-input",11),d.Zb("ngModelChange",function(t){return i.product.price=t}),d.Qb(),d.Qb(),d.Rb(18,"ion-item"),d.Rb(19,"ion-label"),d.qc(20,"Categoria"),d.Qb(),d.Rb(21,"ion-select",12),d.Zb("ngModelChange",function(t){return i.categoryValue=t})("ngModelChange",function(t){return i.CatChange(t)}),d.pc(22,m,3,2,"ng-container",7),d.Qb(),d.Qb(),d.pc(23,y,5,2,"ion-item",13),d.Rb(24,"ion-item"),d.Rb(25,"ion-label",9),d.qc(26,"Descri\xe7\xe3o "),d.Qb(),d.Rb(27,"ion-textarea",14),d.Zb("ngModelChange",function(t){return i.product.description=t}),d.Qb(),d.Qb(),d.Rb(28,"ion-item"),d.Rb(29,"ion-label",9),d.qc(30,"Estoque "),d.Qb(),d.Rb(31,"ion-input",15),d.Zb("ngModelChange",function(t){return i.product.stock=t}),d.Qb(),d.Qb(),d.Rb(32,"ion-button",16),d.pc(33,C,2,0,"span",13),d.pc(34,S,2,0,"span",13),d.Qb(),d.Rb(35,"ion-button",17),d.Zb("click",function(){return i.GoBack()}),d.qc(36,"Cancelar"),d.Qb(),d.Qb(),d.Qb(),d.Qb()}if(2&t){const t=d.lc(5);d.gc("title",i.title),d.Bb(1),d.gc("fullscreen",!0),d.Bb(1),d.gc("title",i.title),d.Bb(1),d.gc("ngClass",d.jc(16,M,!i.isMobile)),d.Bb(3),d.gc("options",i.slideOpts),d.Bb(1),d.gc("ngForOf",i.product.gallery),d.Bb(6),d.gc("ngModel",i.product.name),d.Bb(4),d.gc("ngModel",i.product.price),d.Bb(4),d.gc("ngModel",i.categoryValue),d.Bb(1),d.gc("ngForOf",i.cats),d.Bb(1),d.gc("ngIf",0==i.categoryValue||i.categoryValue),d.Bb(4),d.gc("ngModel",i.product.description),d.Bb(4),d.gc("ngModel",i.product.stock),d.Bb(1),d.gc("disabled",t.invalid),d.Bb(1),d.gc("ngIf",i.product.id),d.Bb(1),d.gc("ngIf",!i.product.id)}},directives:[g.a,s.m,o.i,n.l,n.g,n.h,s.N,o.j,s.M,s.s,s.x,s.r,s.db,n.k,n.j,n.f,n.i,s.Y,s.K,s.cb,o.k,s.Q,s.e,s.L],styles:["img[_ngcontent-%COMP%]{height:200px;margin:5px auto}.webrowser[_ngcontent-%COMP%]{text-align:center;position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);width:var(--maxWidth);margin:0 auto;padding-top:30px}"]}),t})()}];let Q=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=d.Kb({type:t}),t.\u0275inj=d.Jb({imports:[[r.k.forChild(R)],r.k]}),t})();var O=e("dagM");let I=(()=>{class t{}return t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=d.Kb({type:t}),t.\u0275inj=d.Jb({imports:[[o.b,n.a,s.T,Q,O.a]]}),t})()}}]);