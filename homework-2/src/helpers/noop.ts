export function noop(): void {}
export function asyncNoop(): Promise<void> {
    return Promise.resolve();
}
