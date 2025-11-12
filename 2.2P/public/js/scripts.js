async function call(endpoint, params, outEl) {
    try {
        const url = params
            ? `${endpoint}?` + new URLSearchParams(params).toString()
            : endpoint;

        const res = await fetch(url, params ? {} : undefined);
        const text = await res.text();
        try {
            outEl.textContent = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            outEl.textContent = text;
        }
    } catch (e) {
        outEl.textContent = String(e);
    }
}

// Bind GET buttons
document.getElementById('btn-add').addEventListener('click', () => {
    call('/api/add',
        { v1: document.getElementById('add-v1').value, v2: document.getElementById('add-v2').value },
        document.getElementById('out-add'));
});

document.getElementById('btn-sub').addEventListener('click', () => {
    call('/api/subtract',
        { v1: document.getElementById('sub-v1').value, v2: document.getElementById('sub-v2').value },
        document.getElementById('out-sub'));
});

document.getElementById('btn-mul').addEventListener('click', () => {
    call('/api/multiply',
        { v1: document.getElementById('mul-v1').value, v2: document.getElementById('mul-v2').value },
        document.getElementById('out-mul'));
});

document.getElementById('btn-div').addEventListener('click', () => {
    call('/api/divide',
        { v1: document.getElementById('div-v1').value, v2: document.getElementById('div-v2').value },
        document.getElementById('out-div'));
});

document.getElementById('btn-pow').addEventListener('click', () => {
    call('/api/power',
        { v1: document.getElementById('pow-v1').value, v2: document.getElementById('pow-v2').value },
        document.getElementById('out-pow'));
});

document.getElementById('btn-root').addEventListener('click', () => {
    call('/api/root',
        { v1: document.getElementById('root-v1').value, v2: document.getElementById('root-v2').value },
        document.getElementById('out-root'));
});

// Bind POST /calculate
document.getElementById('btn-calc').addEventListener('click', async () => {
    const out = document.getElementById('out-calc');
    let body;
    try {
        body = JSON.parse(document.getElementById('calc-json').value);
    } catch (e) {
        out.textContent = 'Invalid JSON: ' + e.message;
        return;
    }
    try {
        const res = await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const text = await res.text();
        try {
            out.textContent = JSON.stringify(JSON.parse(text), null, 2);
        } catch {
            out.textContent = text;
        }
    } catch (e) {
        out.textContent = String(e);
    }
});