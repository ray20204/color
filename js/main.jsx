var originData;
var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var text = React.findDOMNode(this.refs.text).value.trim();
        this.props.onCommentSubmit({text: text});
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="search data" ref="text" />
            <input type="submit" className="btn btn-sm btn-primary" value="search" />
            <label className="pull-right">資料來源:
            <a href="http://www.gov.taipei/ct.asp?xItem=108880666&ctNode=38161&mp=100001">台北市資訊局</a>
            </label>
            </form>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return {data: [], filter: ''};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
    },
    handleCommentSubmit: function(comment) {
        this.setState({filter: comment.text});
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: 'http://tonyq.org/kptaipei/api-20150628.php',
            dataType: 'json',
            cache: false,
            success: function(data) {
                originData = data.data;
                this.setState({data: data.data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('myurl', status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div className="commentBox">
            <h1>八仙樂園塵爆資訊</h1>
            <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            <CommentList data={this.state.data} filter={this.state.filter}/>
            </div>
        );
    }
});
var test;
var trInfoClass;
var CommentList = React.createClass({
    handleClick: function(id) {
        var filter = this.props.filter = id;
        this.forceUpdate();
    },
    filterData: function(data, filter) {
        var state = false;
        $.each(data, function(index, value) {
            if ('姓名' === index) {
                var taskPosition = value.indexOf("○");
                var compareName = value.replace("○", filter[taskPosition]);
                if (compareName.match(filter) != null) {
                    state = true;
                    return;
                }
            } else {
                if (typeof(value) != "string") {
                    if (value === filter) {
                        state = true;
                        return;
                    }
                } else {
                    if (value.match(filter) != null) {
                        state = true;
                        return;
                    }
                }
            }
        });
        return state;
    },
    render: function() {
        var filter = this.props.filter;
        var commentNodes = [];
        var filterData = this.filterData;
        var handleclick = this.handleClick;
        this.props.data.forEach(function(comment, index) {
            if (filter !== '') {
                if (filterData(comment, filter) != false) {
                    commentNodes.push(<CommentItem item={comment} rowClick={handleclick}/>);
                }
            } else {
                commentNodes.push(<CommentItem item={comment} rowClick={handleclick}/>);
            }
        });
        test = commentNodes;
        return (
            <table className="commentList table table-hover">
                <thead>
                    <tr>
                        <td>編號</td>
                        <td>姓名</td>
                        <td>性別</td>
                        <td>國籍</td>
                        <td>年齡</td>
                        <td>縣市別</td>
                        <td>收治單位</td>
                        <td>檢傷編號</td>
                        <td>醫療檢傷</td>
                        <td>即時動向</td>
                        <td>轉診要求</td>
                    </tr>
                </thead>
                <tbody>
                    {commentNodes}
                </tbody>
            </table>
        );
    }
});
var CommentItem = React.createClass({
    handleClick: function() {
        var id = this.props.item.編號;
        this.props.rowClick(id);
    },
    colortag: '',
    setColorTag: function(state) {
        var trInfoClass = {'加護病房': 'listitem danger', '死亡': 'listitem danger', '出院': 'listitem success'};
        this.colortag = trInfoClass[state];
    },
    render: function() {
        var comment = this.props.item;
        this.setColorTag(comment.即時動向);
        return (
            <tr className={this.colortag} onClick={this.handleClick}>
                <td>{comment.編號}</td>
                <td>{comment.姓名}</td>
                <td>{comment.性別}</td>
                <td>{comment.國籍}</td>
                <td>{comment.年齡}</td>
                <td>{comment.縣市別}</td>
                <td>{comment.收治單位}</td>
                <td>{comment.檢傷編號}</td>
                <td>{comment.醫療檢傷}</td>
                <td>{comment.救護檢傷}</td>
                <td>{comment.即時動向}</td>
                <td>{comment.轉診要求}</td>
            </tr>
        );
    }
});

React.render(
    <CommentBox />,
    document.getElementById('content')
);
