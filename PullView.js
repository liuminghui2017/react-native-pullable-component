import React from 'react'
import { ScrollView } from 'react-native'
import Pullable from './Pullable'

class PullView extends Pullable {
	constructor(props) {
		super(props);
		this.scrollTo = this.scrollTo.bind(this);
	}

	scrollTo({ offset, animated }) {
		this.scroll && this.scroll.scrollTo({ y: offset, animated });
	}

	getScrollable(refreshControl) {
		const { children, hiddenView, ...others} = this.props
		return (
			<ScrollView {...others} ref={(c) => { this.scroll = c; }} scrollEnabled={this.state.scrollEnabled} onScroll={this.onScroll}>
				{this.props.children}
			</ScrollView>
		)
	}
}

export default PullView
