import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { Query } from 'react-apollo';
import client from './client';
import { SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
  first: 5,
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

  console.log({ query });

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
            return <h2>{title}</h2>
          }
        }
      </Query>
    </ApolloProvider>
  );
};

export default App;
