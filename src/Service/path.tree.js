let Path = require('./path')
let logger = require('./../Log/Logger')

class PathTree {
  constructor () {
    this.tree = {
      '': {
        subtree: {}
      }
    }
    this.serializedTree = { '': {} }
    this.plainTree = []
  }

  /**
   * Note that the service layer is responsible for
   * 1- validating this path
   * 2- formatting it to standard value
   */
  createPathSubtree (path, fn) {
    let tokens = Path.getTokes(path)
    let tree = this.tree
    let stree = this.serializedTree
    for (let token of tokens) {
      if (tree[token] === undefined) {
        tree[token] = {subtree: {}}
      }
      if (token !== tokens[tokens.length - 1]) {
        tree = tree[token].subtree
      } else {
        tree = tree[token]
      }
      if (stree[token] === undefined) {
        stree[token] = {}
      }
      stree = stree[token]
    }

    if (fn) {
      tree.fn = fn
    }
    this.plainTree.push({path: path, name: fn.name || 'anonymousFN'})
    return 1
  }

  getPathFunction (path) {
    console.log(1, path)
    let pathTokens = path.split('/')
    console.log(pathTokens)
    let tree = this.tree
    let token
    for (let i = 0; i < pathTokens.lenght; i++) {
      console.log('here')
      token = pathTokens[i]
      console.log(i, token, tree)
      if (tree[token]) {
        if (i === pathTokens.length - 1) {
          return tree[token].fn
        } else {
          tree = tree[token].subtree
        }
      } else {
        return false
      }
    }
  }

  getMatches (path, startTree = this.serializedTree) {}
}

module.exports = PathTree
