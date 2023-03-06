type DebouncedFunction = (...args: unknown[]) => unknown

function createDebouncedFunction<T extends DebouncedFunction>(
  fn: T,
  delay?: number,
): DebouncedFunction {
  let timeoutId: ReturnType<typeof setTimeout>

  const debouncedFn: DebouncedFunction = (...args) => {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => fn(args), delay)
  }

  return debouncedFn
}

export default createDebouncedFunction
