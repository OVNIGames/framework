import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export type IPaginationDataSourceGetter<T> = (page?: number, pageSize?: number) => Observable<T[]>;

export class PaginationDataSource<T> extends DataSource<T> {
  private cachedData = Array.from<T>({ length: this.length });
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<T[]>(this.cachedData);
  private subscription = new Subscription();

  public constructor(
    private getter: IPaginationDataSourceGetter<T>,
    private length: number,
    private pageSize: number = 50,
    pages: Record<number, T[]> = {}
  ) {
    super();

    Object.keys(pages).forEach(key => {
      const page = Number(key);
      this.fetchedPages.add(page);
      this.setPageData(page, pages[key]);
    });
  }

  public connect(collectionViewer: CollectionViewer): Observable<T[]> {
    this.subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this.getPageForIndex(range.start);
        const endPage = this.getPageForIndex(range.end - 1);

        for (let i = startPage; i <= endPage; i++) {
          this.fetchPage(i);
        }
      })
    );

    return this.dataStream;
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private setPageData(page: number, data: T[]) {
    this.cachedData.splice(page * this.pageSize, this.pageSize, ...data);
  }

  private fetchPage(page: number) {
    if (this.fetchedPages.has(page)) {
      return;
    }

    this.fetchedPages.add(page);

    this.getter(page, this.pageSize).subscribe(data => {
      this.setPageData(page, data);
      this.dataStream.next(this.cachedData);
    });
  }
}
