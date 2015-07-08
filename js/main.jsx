var originData;
var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        //var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        //if (!text || !author) {
            //return;
            //}
        this.props.onCommentSubmit({text: text});
        //React.findDOMNode(this.refs.author).value = '';
        //React.findDOMNode(this.refs.text).value = '';
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="search name" ref="text" />
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
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
    },
    handleCommentSubmit: function(comment) {
        var result = $.grep(originData, function(el, ind) {
            var taskPosition = el.姓名.indexOf("○");
            var compareName = el.姓名.replace("○", comment.text[taskPosition]);
            return compareName.match(comment.text);
        });
        this.setState({data: result});
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
            <CommentList data={this.state.data} />
            </div>
        );
    }
});
var test;
var trInfoClass;
var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function(comment, index) {
            trInfoClass = {'加護病房': 'listitem danger', '死亡': 'listitem danger', '出院': 'listitem success'};
            return (
                <tr key={index} className={trInfoClass[comment.即時動向]}>
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

React.render(
    <CommentBox />,
    document.getElementById('content')
);
