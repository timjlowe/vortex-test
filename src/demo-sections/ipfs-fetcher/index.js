import React from 'react';
import {Panel} from "react-bootstrap";
import {FormGroup, ControlLabel, FormControl, HelpBlock, Button} from 'react-bootstrap';
import IsIpfs from 'is-ipfs';
import {connect} from "vort_x-components";
import {IPFSLoad} from "vort_x";

function FieldGroup({ id, label, help, ...props }) {
    return (
        <FormGroup controlId={id}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl {...props} />
            {help && <HelpBlock>{help}</HelpBlock>}
        </FormGroup>
    );
}

export class _FetchHash extends React.Component {
    render() {
        if (IsIpfs.multihash(this.props.ipfs_hash)) {
            if (!this.props.content) {
                this.props.IPFSLoad(this.props.ipfs_hash);
                return (<code>FETCHING ...</code>)
            } else {
                if (this.props.content.content) {
                    return (<code>{this.props.content.content.toString()}</code>)
                } else if (this.props.content.error) {
                    return (<div>
                        <h1>Something went wrong :( Try text data and it will work (it gets random when trying to fetch directories)</h1>
                        <code>{this.props.content.error.message}</code>
                    </div>)
                }
            }
        }
        return (<div></div>)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        content: IsIpfs.multihash(ownProps.ipfs_hash) ? state.ipfs[ownProps.ipfs_hash] : undefined
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        IPFSLoad: (hash) => {dispatch(IPFSLoad(hash))}
    }
};

const FetchHash = connect(_FetchHash, mapStateToProps, mapDispatchToProps);

export class IPFSFetcher extends React.Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
        this.state = {
            ipfs_hash: ""
        }
    }

    update(event) {
        event.preventDefault();
        this.setState({
            ipfs_hash: this.ipfs.value
        });
    }

    render() {
        return (<Panel>
            <Panel.Heading>Example #7: Fetch Data from IPFS and store it in cache</Panel.Heading>
            <Panel.Body>
                <form onSubmit={this.update}>
                    <FieldGroup
                        id="ipfs"
                        type="string"
                        label="Fetch Data From IPFS"
                        placeholder="Enter IPFS Hash"
                        inputRef={input => this.ipfs = input}
                    />
                    <Button type="submit">Fetch !</Button>
                </form>
                <FetchHash ipfs_hash={this.state.ipfs_hash}/>
            </Panel.Body>
        </Panel>);
    }
}
