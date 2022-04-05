export function makeIdGenerator() {
    let lastId = 0;

    return () => {
        lastId += 1;

        return lastId;
    };
}

export function nameToSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/, '-').replace(/-+/, '-');
}

export function categoryHasProducts(category, products) {
    return products.filter((product) => (
        product.categories.findIndex((x) => x.slug === category.slug) !== -1
    )).length > 0;
}
