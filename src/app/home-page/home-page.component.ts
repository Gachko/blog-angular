import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../shared/post.service";
import {Subscription} from "rxjs";
import {Post} from "../shared/interfaces";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy{

  pSub!: Subscription
  posts!: Post[]

  constructor(private postService: PostService) {}
  ngOnInit(): void {
   this.pSub = this.postService.getAll()
     .subscribe(posts => this.posts = posts)
  }

  ngOnDestroy(): void {
    if(this.pSub) {
      this.pSub.unsubscribe()
    }
  }


}
