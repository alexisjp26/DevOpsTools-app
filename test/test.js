let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const url = 'http://localhost:3001';
chai.use(chaiHttp);


describe('/GET Tools: ', () => {
    it('Should get all the DevOps tools', (done) => {
        chai.request(url)
            .get('/tools')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

describe('/GET/id Tools', () => {
    it('it should get the tool by the given id', (done) => {
        chai.request(url)
            .get('/tools/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('id').to.be.equal(1);
                done();
            });
    });
});

describe('/POST Tools', () => {
    it('it should add a Tool', (done) => {
        let tool = {};
        tool.id = 7;
        tool.name = 'Puppet';
        chai.request(url)
            .post('/tools')
            .send(tool)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').equal(`Tool ${tool.name} was succesfully added to the app`);
                done();
            });
    });
});

describe('/PUT Tools', () => {
    it('it should update a Tool, based on the id', (done) => {
        let tool = {};
        tool.id = 7;
        tool.name = 'Ansible';
        chai.request(url)
            .put('/tools/7')
            .send(tool)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').equal(`Tool ${tool.name} was successfully edited`);
                done();
            });
    });
});

describe('/DELETE Tools', () => {
    it('it should delete a Tool, based on the id', (done) => {
        chai.request(url)
            .delete('/tools/7')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('message').equal(`Tool Ansible was deleted`);
                done();
            });
    });
});





