import React from 'react'
import { FlatList } from 'react-native'
import Pullable from './Pullable'

class PullList extends Pullable {
	constructor(props) {
		super(props);
		this.scrollTo = this.scrollTo.bind(this);
	}

	scrollTo({ offset, animated }) {
		this.scroll && this.scroll.scrollToOffset({ offset, animated });
	}

	getScrollable(refreshControl) {
		const { children, hiddenView, ...others} = this.props
		return (
			<FlatList {...others} ref={(c) => { this.scroll = c; }} scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll} />
		)
	}
}

export default PullList
