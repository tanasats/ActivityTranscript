import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {
  ReactiveFormsModule,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  HttpHeaders,
  HttpRequest,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit,ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {trigger, state,style, animate, transition} from '@angular/animations';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [
    trigger('fade', [ 
      transition('void => *', [
        style({ opacity: 0 }), 
        animate(2000, style({opacity: 1}))
      ]) 
    ]),

    trigger('toggleBox', [
      state('open', style({
        //height: '200px',
        opacity:100,
        visibility:'visible', 
        //width:'100%',
        //backgroundColor: '#061ff0'
      })),
      state('close', style({
        //height: '70px',
        opacity:0,
        visibility:'hidden',
        //right:'-1px'
        //width:0,
        //backgroundColor: '#E91E63',
      })),
      transition('open => close', [
        animate('0.5s')
      ]),
      transition('close => open', [
        animate('0.5s')
      ]),
    ])

  ],
})


export class UserComponent implements OnInit {
  constructor(
    private userServcie: UserService, 
    public router: Router) {}
  users: any;
  notifyMessage = '';
  isShowNotify = false;


  formCreate = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  formUpdate = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  get fc() {
    return this.formCreate.controls;
  }
  get fu() {
    return this.formUpdate.controls;
  }

  ngOnInit(): void {
    // initial value to form by formControl
    this.formUpdate.setValue({ id: '', name: '', email: '', password: '' });
    this.getAll();
  }

  getAll(): void {
    console.log('getall()');
    this.userServcie.getAll().subscribe(
      (res) => {
        //console.log('subscribe:rxjs -->(res)');  console.log(res);
        this.users = res;
      },
      (err) => {
        //console.log('subscribe:rxjs -->(err)');  console.log(err);
        if (err.message) {
          this.showNotify(err.message);
        } else {
          this.showNotify(err);
        }
      }
    );
  }

  private insert(data: any) {
    this.userServcie.insert(data).subscribe(
      (response) => {
        // http response
        console.log('Insert response form api-->');
        console.log(response);
        if (response.affectedRows) {
          this.showNotify('เพิ่มผู้ใช้ใหม่แล้ว');
          this.getAll();
        } else {
          console.log('affectedRows is false');
        }
      },
      (err) => {
        if (err.message) {
          //this.showNotify('ไม่สามารถเพิ่มผู้ใช้ใหม่ได้')
          this.showNotify('ผิดพลาด!'+ err.message);
        } else {
          this.showNotify(err);
        }
      }
    );
  }
  private delete(id: any) {
    this.userServcie.delete(id).subscribe(
      (response) => {
        console.log('Delete response form api-->');
        console.log(response);
        if (response.affectedRows) {
          this.showNotify('ลบข้อมูลเรียบร้อยแล้ว');
          this.getAll();
        } else {
          this.showNotify('ไม่สามารถลบข้อมูลได้');
        }
      },
      (err) => {
        if (err.message) {
          this.showNotify(err.message);
        } else {
          this.showNotify(err);
        }
      }
    );
  }
  private update(id: any, data: any) {
    this.userServcie.update(id, data).subscribe(
      (response) => {
        console.log('Update response form api-->');
        console.log(response);
        if (response.affectedRows) {
          this.showNotify('แก้ไขข้อมูลแล้ว');
          this.formUpdate.reset();
          this.getAll();
        } else {
          console.log('affectedRows is false');
        }
      },
      (err) => {
        if (err.message) {
          this.showNotify(err.message);
        } else {
          this.showNotify(err);
        }
      }
    );
  }

  //  UI evnet function
  onDelete(id: any) {
    this.delete(id);
  }
  onUpdate(data: any) {
    this.userServcie.getById(data).subscribe(
      (res) => {
        if (res) {
          this.formUpdate.patchValue(res[0]);
        }
      },
      (err) => {
        if (err.message) {
          this.showNotify(err.message);
        } else {
          this.showNotify(err);
        }
      }
    );
  }
  onSubmitCreate() {
    if (this.formCreate.valid) {
      this.insert(this.formCreate.value);
      this.formCreate.reset();
    }
  }
  onSubmitUpdate() {
    console.log(this.formUpdate.value);
    if (this.formUpdate.valid) {
      console.log('formUpdate is valid');
      let data = this.formUpdate.value;
      this.update(data.id, data);
    }
  }

  
  // Util function
  showNotify(msg: any) {
    this.notifyMessage = msg;
    this.isShowNotify = true;
    setTimeout(() => {
      //this.notifyMessage = '';
      this.isShowNotify = false;
    }, 1500);
  }
}
