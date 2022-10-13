export function createEventBus() {
  const cache: Record<string, any> = {}

  function $emit(action: any, payload: any) {
    const fn = cache[action]
    if(fn) {
      fn(payload)
    }
  }
  
  function $on(action: any, cb: any) {
    cache[action] = (...args: any) => cb(...args)
  }

  function $once(action: any, cb: any) {
    $on(action, (...args: any) => {
      cb(...args)
      $off(action)
    })
  }

  function $off(action: any) {
    if(cache[action]) {
      delete cache[action]
    }
  }

  return {
    $emit,
    $on,
    $once,
    $off,
  }
}