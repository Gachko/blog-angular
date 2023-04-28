import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../shared/post.service";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../../shared/interfaces";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy{

  post!: Post

  submitted = false

  uSub!: Subscription

  form!: FormGroup
      constructor(
        private route: ActivatedRoute,
        private postsService: PostService,
        private alert: AlertService
      ) {}

  ngOnInit() {
        this.route.params.pipe(
          switchMap((params: Params) => {
            return this.postsService.getById(params['id'])
          })
    ).subscribe((post: Post) => {
      this.post = post
          this.form = new FormGroup({
              title: new FormControl(post.title, Validators.required),
              text: new FormControl(post.text, Validators.required)
          })
        })
  }

  submit() {
        if(this.form.invalid) return
    this.submitted = true
    this.uSub = this.postsService.update({
     ...this.post,
      text: this.form.value.text,
      title: this.form.value.title,
    }).subscribe(() => {
      this.alert.success('Post has been edited')
        this.submitted = false
    })
  }

  ngOnDestroy() {
    if(this.uSub) {
      this.uSub.unsubscribe()
    }
  }
}
