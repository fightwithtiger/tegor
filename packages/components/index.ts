import Foo from './foo'

Foo.install = function () {
  console.log('insall')
}

export {
  Foo
}

export * from './tree'
export * from './virtualTree'

