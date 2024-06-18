import { MatPaginatorIntl } from "@angular/material/paginator"

export const getPaginatorFooter = () => {
    const intl = new MatPaginatorIntl();

    intl.itemsPerPageLabel = 'Itens por página:';
    intl.nextPageLabel = 'Próxima página';
    intl.previousPageLabel = 'Página anterior';
    intl.getRangeLabel = (page, size, length) => `Página ${page + 1}`;
    
    return intl;
}