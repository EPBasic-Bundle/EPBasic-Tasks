import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'search'
})

export class SearchPipe implements PipeTransform {

    transform(items: any[], searchTerm: string): any {
        if (searchTerm == null || !items) {
            return items;
        }

        // return items.filter(
        //     product => product.name.toLocaleLowerCase().indexOf(
        //         searchTerm.toLocaleLowerCase()
        //     ) !== -1);
        return items;
    }
}
