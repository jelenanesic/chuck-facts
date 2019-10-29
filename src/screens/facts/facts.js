import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/* actions */
import { getFacts, getViewedFacts, setFactsEmpty } from './facts-actions';
/* components */
import Search from '../../components/search/search';
import Card from '../../components/card/card';
import FactListItem from '../../components/fact-list-item/fact-list-item';
/* utils */
import { setFactToLocalStorage, getItemFromLocalStorage } from '../../utils/info-helper';

class Facts extends React.Component {
    componentDidMount() {
        this.props.getViewedFacts();
    }

    componentWillUnmount() {
        this.props.setFactsEmpty();
        if (this.debounce) {
            clearTimeout(this.debounce);
        }
    }

    onChange = (e) => {
        const query = e.target.value;
        if (this.debounce) {
            clearTimeout(this.debounce);
        }
        if (query.length >= 3) {
            this.debounce = setTimeout(() => this.props.getFacts(query), 500);
        }
    };

    onItemClick = (fact) => {
        const viewedFacts = getItemFromLocalStorage('viewedFacts');

        if (viewedFacts && viewedFacts.length){
            let foundFact = viewedFacts.find(viewedFact => viewedFact.id === fact.id);
            if(!foundFact) {
                setFactToLocalStorage(fact, 'viewedFacts');
            }
        } else {
            setFactToLocalStorage(fact, 'viewedFacts');
        }
    };

    render() {
        const isRandom = !getItemFromLocalStorage('viewedFacts');
        return (
            <React.Fragment>
                <Search
                    onChange={this.onChange}
                    searchResults={this.props.facts}
                    onItemClick={this.onItemClick}
                />
                <Card
                    title={isRandom ? "We are showing random facts" : "Recently viewed facts"}
                    subtitle={isRandom ? "Try searching for some fact above" : "Last 10 results"}
                >
                    {this.props.viewedFacts.map(fact => (
                        <FactListItem
                            key={fact.id}
                            item={fact}
                            onItemClick={this.onItemClick}
                        />)
                    )}
                </Card>
            </React.Fragment>
        )
    }
}

Facts.propTypes = {
    facts: PropTypes.array.isRequired,
    getFacts: PropTypes.func.isRequired,
    getViewedFacts: PropTypes.func.isRequired,
    viewedFacts: PropTypes.array.isRequired
};

function mapStateToProps(state) {
    return {
        facts: state.factsReducer.facts,
        viewedFacts: state.factsReducer.viewedFacts
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getFacts: (query) => getFacts(dispatch, query),
        getViewedFacts: () => getViewedFacts(dispatch),
        setFactsEmpty: () => setFactsEmpty(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Facts);