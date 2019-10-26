import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';
import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const StarButton = props => {
  const totalCount = props.node.stargazers.totalCount;
  return <button>{totalCount === 1 ? `1 star` : `${totalCount} stars`}</button>
};

const PER_PAGE = 5;
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア",
};

const App = () => {
  const [state, setState] = useState(DEFAULT_STATE);
  const { query, first, last, before, after } = state;

  const handleChange = (event) => {
      setState({
        ...DEFAULT_STATE,
        query: event.target.value,
      })
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const goPrevious = (search) => {
    setState({
      ...state,
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor,
    })
  };

  const goNext = (search) => {
    setState({
      ...state,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null,
    })
  };

  return (
    <ApolloProvider client={client}>
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={handleChange} />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ query, first, last, before, after }}
      >
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            const search = data.search;
            const repositoryCount = search.repositoryCount;
            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
            const title =  `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`;
            return (
              <>
                <h2>{title}</h2>
                <ul>
                  {
                    search.edges.map(edge => {
                      const node = edge.node;

                      return (
                        <li key={node.id}>
                          <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                          &nbsp;
                          <StarButton node={node} />
                        </li>
                      )
                    })
                  }
                </ul>

                {
                  search.pageInfo.hasPreviousPage ?
                    <button
                      type="button"
                      onClick={() => goPrevious(search)}
                    >
                      Previous
                    </button>
                    : null
                }
                {
                  search.pageInfo.hasNextPage ?
                    <button
                      type="button"
                      onClick={() => goNext(search)}
                    >
                      Next
                    </button>
                    : null
                }
              </>
            )
          }
        }
      </Query>
    </ApolloProvider>
  );
};

export default App;
