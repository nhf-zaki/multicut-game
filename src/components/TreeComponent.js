import React from 'react';
import { Tree } from 'react-tree-graph';

import tree_data from '../data/tree-data.json';

let data = tree_data;

function TreeComponent() {
  return <Tree data={data} height={600} width={300}></Tree>;
}

export default TreeComponent;
