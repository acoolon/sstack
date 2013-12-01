import re
import flask

app = flask.Flask(__name__, static_url_path='')
username = re.compile('\A([^\W\d_]| )+\Z')
stack = list()

@app.route('/stack', methods=('GET',))
def view_stack():
    return flask.jsonify(stack=stack)

@app.route('/stack/<name>', methods=('POST',))
def add_speaker(name):
    name = name.strip()
    if username.match(name) and not name in stack:
        stack.append(name)
        return ('', 201)
    else: flask.abort(400)

@app.route('/stack/<name>', methods=('DELETE',))
def delete_speaker(name):
    name = name.strip()
    if name in stack:
        stack.remove(name)
        return ('', 204)
    else: flask.abort(400)

if __name__ == '__main__': app.run(host='0.0.0.0')
