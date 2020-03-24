import { FindOptions, UpdateOptions, Op, WhereOperators } from 'sequelize';

type Condition<T> = (element: T) => boolean;

export function executeQuery<T>(options: FindOptions | UpdateOptions, collection: Array<T>): Array<T> {
    const conditions: Array<Condition<T>> = [];
    const result: Array<T> = [];
    if (options.where) {
        for (const prop of Object.keys(options.where)) {
            if (typeof (options.where as any)[prop] === 'object') {
                conditions.concat(handleOperators(options.where as WhereOperators, prop as keyof T));
            } else {
                conditions.push(el => (el as any)[prop] === (options.where as any)[prop]);
            }
        }
    }
    for (const element of collection) {
        if (conditions.every(cb => cb(element))) {
            result.push(element);
        }
    }
    const order = (options as FindOptions).order;
    if (Array.isArray(order)) {
        for (const orderOptions of order) {
            if (Array.isArray(orderOptions)) {
                const [prop, direction] = orderOptions;
                result.sort((a: any, b: any) =>
                    direction === 'ASC'
                        ? b[prop as string].localeCompare(a[prop as string])
                        : a[prop as string].localeCompare(b[prop as string])
                );
            }
        }
    }
    return result.slice(0, options.limit ?? result.length);
}

function handleOperators<T>(operators: WhereOperators, prop: keyof T): Array<Condition<T>> {
    const conditions: Array<Condition<T>> = [];
    for (const [operator, value] of Object.entries(operators)) {
        // eslint-disable-next-line default-case
        switch (operator as unknown as symbol) {
            case Op.like:
                conditions.push((el) => new RegExp(`^${value.replace(/%/g, '.*')}$`).test(el[prop] as unknown as string));
                break;
        }
    }
    return conditions;
}
