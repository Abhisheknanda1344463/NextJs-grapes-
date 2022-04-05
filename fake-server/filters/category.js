import {
    categoriesListData,
    categoriesTreeData,
    prepareCategory,
} from '../database/categories';
import AbstractFilterBuilder from './abstract';
// eslint-disable-next-line no-unused-vars
import productsData from '../database/products';
// eslint-disable-next-line no-unused-vars
import { categoryHasProducts } from '../utils';

export default class CategoryFilterBuilder extends AbstractFilterBuilder {
    value = null;

    items = [];

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    test(product) {
        if (this.value === null) {
            return true;
        }

        // return product.categories.reduce((acc, category) => (
        //     acc || category.slug === this.value
        // ), false);

        return true;
    }

    makeItems(products, value) {
        this.value = value || null;

        const category = categoriesListData.find((x) => x.slug === value);
        // const categoryHasProductsFn = (x) => categoryHasProducts(x, productsData);
        const categoryHasProductsFn = () => true;

        if (category) {
            this.items = [prepareCategory(category, 1)].map((x) => ({
                ...x,
                children: x.children.filter(categoryHasProductsFn),
            }));
        } else {
            this.items = categoriesTreeData
                .map((x) => prepareCategory(x))
                .filter(categoryHasProductsFn);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    calc() {}

    build() {
        return {
            type: 'category',
            slug: this.slug,
            name: this.name,
            items: this.items,
            value: this.value,
        };
    }
}
