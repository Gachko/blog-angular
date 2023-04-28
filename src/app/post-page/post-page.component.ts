import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../shared/post.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {Post} from "../shared/interfaces";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit, OnDestroy {

  pSub!: Subscription
  post!:Post

  constructor(private postService: PostService,
              private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.pSub = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
    ).subscribe(post => this.post = post)
  }

  ngOnDestroy(): void {
    if(this.pSub) {
      this.pSub.unsubscribe()
    }
  }


}
