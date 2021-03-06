import { Component } from "react";
import "./App.css";
import Customer from './components/Customer';
import CustomerAdd from "./components/CustomerAdd";
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';



const styles = theme => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(3),
		overflowX: "auto"
	},
	table: {
		minWidth: 1080
	},
	progress: {
		margin: theme.spacing(2)
	}
})

/*

	*component life Cycle
	1) constructor()
	2) compoenetWillMount()
	3) render()
	4) compoenetDidMount()

	props or state => shouldComponentUpdate()


*/





class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			customers : '',
			completed : 0
		}
	}

	stateRefresh = () => {
		this.setState({
			customers : '',
			completed : 0
		});
		this.callApi()
			.then(res => this.setState({ customers: res }))
			.catch(err => console.log(err));
	}

	componentDidMount() {
		this.timer = setInterval(this.progress, 800);
		this.callApi()
			.then(res => this.setState({ customers: res }))
			.catch(err => console.log(err));
	}

	callApi = async () => {
		const response = await fetch('api/customers');
		const body = await response.json();
		return body;
	}

	// progress = () => {
	// 	const { completed } = this.state;
	// 	this.setState({ completed: completed >= 100 ? 0 : completed + 10 });
	// }

	render() {
		const { classes } = this.props;
		return (
			<div>
				<Paper className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>번호</TableCell>
							<TableCell>이미지</TableCell>
							<TableCell>이름</TableCell>
							<TableCell>생년월일</TableCell>
							<TableCell>성별</TableCell>
							<TableCell>직업</TableCell>
							<TableCell>설정</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.customers ? this.state.customers.map(c => { return (<Customer stateRefresh={this.stateRefresh} key={c.ID} id={c.ID} image={c.IMAGE} name={c.NAME} birthday={c.BIRTHDAY} gender={c.GENDER} job={c.JOB} />) })
							:
							<TableRow>
								<TableCell colSpan="6" align="center">
									<CircularProgress />
								</TableCell>
							</TableRow>
						}
					</TableBody>
				</Table>
			</Paper>
			<CustomerAdd stateRefresh = {this.stateRefresh} />
			</div>
			
		)
	}
}

export default withStyles(styles)(App);
