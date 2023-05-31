import React from 'react';
import { Link } from 'react-router-dom';

import './tutorial.css';
import valid from '../../assets/valid.png';
import invalid from '../../assets/invalid.png';

function Tutorial() {
  return (
    <div>
      <div>
        <Link to={`/`} className="btn-main" style={{ margin: '3vh 15%' }}>
          <i className="fa fa-home" />
          &nbsp; Back to Main Menu
        </Link>
      </div>
      <div className="title">Tutorial</div>
      <div className="t-container">
        <div className="t-content">
          <h1>Game Logic</h1>
          <p>
            In the multicut problem, it is important to note that cutting
            arbitrary edges does not necessarily constitute a valid solution.
            This is demonstrated in Figure 1, which depicts a grid graph with
            different sets of multicut edges. In the figure, the red-colored
            edges are potential cuts. However, it can be observed that despite
            cutting these edges (dashed edges), the graph remains connected and
            does not split into multiple components (see Figure 1).
            Consequently, this cut cannot be considered as a valid multicut.
          </p>
          <figure>
            <img src={invalid} alt="invalid" />
            <figcaption>Figure 1: Invalid Multicut</figcaption>
          </figure>
          <p>
            On the other hand, if we make different set of the cuts (dashed
            edges) to the graph, it can be partitioned into three distinct
            components, as illustrated in Figure 2. In this case, the cut on the
            Figure 2 can be classified as a valid multicut since it effectively
            separates the graph into multiple disconnected components.
            Conversely, the cut on the Figure 1 does not result in a graph
            partition and thus cannot be considered as a valid multicut.
          </p>
          <figure>
            <img src={valid} alt="valid" />
            <figcaption>Figure 2: Valid Multicut</figcaption>
          </figure>
          {/* <p>
            To formally define a valid multicut, we consider a set of edges $M
            \subseteq E$ is a valid multicut of a graph $G = (V, E)$ if and only
            if there is no cycle in graph $G$ that intersect with $M$ in exactly
            one edge.
          </p> */}
          <p>
            In the case of the multicut on the Figure 2, it satisfies this
            condition. For instance, the cycle involving nodes 4, 5, 9, and 8
            does not intersect with the cut edges. This cycle either contains
            two cut edges or none at all. There does not exist a cycle that
            contains precisely one cut edge, as crossing one cut edge
            immediately leads to a new component, requiring at least one more
            cut edge to return to the original component. On the other hand, the
            multicut example on the Figure 1 does not meet this condition. There
            is exactly one cut edge on this cycle, which is not permissible. The
            same applies to the other cycles.
          </p>
          <p>
            This example emphasizes the importance of finding cuts that achieve
            the desired separation of the graph into multiple components, while
            taking into account the connectivity of the graph. Valid multicut
            solutions must meet the criterion of disconnecting the graph into
            disjoint components, and merely cutting arbitrary edges may not
            fulfill this requirement.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
