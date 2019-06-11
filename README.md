## Property
#### hiddenView
	下拉组件
#### hiddenViewHeight
	下拉组件高度

## Usage
```
	import { PullList } from 'react-native-pullalbe-component'

	render() {
		return(
			<PullList
				hiddenView={<View />}
				hiddenViewHeight={100}
				renderItem={({item}) => <Text>{item}</Text>}
				data={this.state.data} />
		)
	}

```
	