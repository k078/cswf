import { Component, OnInit, OnDestroy } from '@angular/core';
import { VerzamelingService } from '../verzameling.service';
import { IVerzameling } from '@cswf/shared/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'cswf-verzameling-list',
    templateUrl: './verzameling-list.component.html',
    styleUrls: ['./verzameling-list.component.css'],
})
export class VerzamelingListComponent implements OnInit, OnDestroy {
    verzamelingen: IVerzameling[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private VerzamelingService: VerzamelingService) {}

    ngOnInit(): void {
        this.subscription = this.VerzamelingService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.verzamelingen = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
