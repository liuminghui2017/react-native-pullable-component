
import React, { Component } from 'react';
import { StyleSheet, View, FlatList, PanResponder, Animated } from 'react-native';

class Pullable extends Component {
  constructor(props) {
    super(props)
		this.y = 0
		this.height = this.props.hiddenViewHeight || 64
		this.threshold = this.height / 2
    this.onScroll = this.onScroll.bind(this)
		this.createPanResponder()

		this.state = {
      animType: 0,
      scrollEnabled: false,
      marginTop: new Animated.Value(-this.height),
    }
  }


  render() {
    let m = this.state.marginTop.interpolate({
      inputRange: [-this.height, 0, this.height],
      outputRange: [-this.height, -this.height, 0],
      extrapolate: 'clamp',
    })
    if (this.state.animType == 1) {
      m = this.state.marginTop.interpolate({
        inputRange: [-this.height, 0],
        outputRange: [-this.height, 0],
        extrapolate: 'clamp',
      })
    }

    return (
      <View style={styles.container} {...this._panResponder.panHandlers} >
        <Animated.View style={[styles.pullableBlock, { marginTop: m, height: this.height }]}>
					{this.props.hiddenView}
				</Animated.View>
        {this.getScrollable()}
      </View>
    );
  }

  createPanResponder() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.onStartShouldSetPanResponder.bind(this),
      onMoveShouldSetPanResponder: this.onMoveShouldSetPanResponder.bind(this),
      onPanResponderGrant: this.onPanResponderGrant.bind(this),
      onPanResponderMove: this.onPanResponderMove.bind(this),
      onPanResponderRelease: this.onPanResponderRelease.bind(this),
      onPanResponderTerminate: this.onPanResponderTerminate.bind(this)
    })
  }

  onStartShouldSetPanResponder(e, gs) {
    return !this.state.scrollEnabled
  }

  onMoveShouldSetPanResponder(e, gs) {
    return !this.state.scrollEnabled
  }

  onPanResponderGrant(e, gs) {
    this.guessIntention = true
  }

  onPanResponderMove(e, gs) {
    if (this.guessIntention) {
      this.tryToOpen = gs.dy > 0 && !this.isBarShow
      this.tryToClose = gs.dy < 0 && this.isBarShow
      this.guessIntention = false
    }
    if (this.tryToOpen || this.tryToClose) {
      Animated.event([null, { dy: this.state.marginTop }]).call(this, e, gs)
    } else {
			this.scrollTo({ offset: gs.dy * -1, animated: false })
    }
  }

  onPanResponderRelease(e, gs) {
    if (!this.isBarShow && gs.dy < 0) {
      // 做惯性动作
      // this.scrollTo({ offset: gs.dy * -1 + gs.vy * gs.vy * 10000 / (2 * 9.88), animated: true})
    } else {
      this.inertiaAnimate.call(this, e, gs)
    }
  }

  onPanResponderTerminate(e, gs) {
    if (!this.isBarShow && gs.dy < 0) {
      // 做惯性动作
      // this.scrollTo({ offset: gs.dy * -1 + gs.vy * gs.vy * 10000 / (2 * 9.88), animated: true})
    } else {
      this.inertiaAnimate.call(this, e, gs)
    }
  }

  inertiaAnimate(e, gs) {
    if (!this.isBarShow) {
      if (gs.dy >= this.threshold) { // 下拉超过一半
        Animated.timing(this.state.marginTop, {
          duration: 300,
          toValue: this.height
        }).start(() => {
          this.setState({ animType: 1 })
        })
        this.isBarShow = true
      } else {
        Animated.timing(this.state.marginTop, {
          duration: 300,
          toValue: -this.height
        }).start(() => {
          this.setState({ animType: 0 })
        })
        this.isBarShow = false
      }
    } else {
      if (gs.dy <= -this.threshold) { // 上拉超过一半
        Animated.timing(this.state.marginTop, {
          duration: 300,
          toValue: -this.height
        }).start(() => {
          this.setState({ animType: 0 })
        })
        this.isBarShow = false
      } else {
        Animated.timing(this.state.marginTop, {
          duration: 300,
          toValue: 0,
        }).start(() => {
          this.setState({ animType: 1 })
        })
        this.isBarShow = true
      }
    }
  }


  onScroll({ nativeEvent }) {
    this.y = nativeEvent.contentOffset.y
    if (this.y <= 0) {
      this.setState({ scrollEnabled: false })
    } else if (!this.state.scrollEnabled) {
      this.setState({ scrollEnabled: true })
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pullableBlock: {
		
  },
});

export default Pullable

