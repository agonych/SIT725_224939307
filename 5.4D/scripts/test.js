// Create book b6: expect 201
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b6',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A visionary mathematician’s secret Foundation of scientists on a remote world navigates political and religious crises to guide humanity through the fall of the Galactic Empire.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Create book b6 → expect 201, got',r.status,t)));

// Duplicate book id b6: expect 409
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b6',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Duplicate id → expect 409, got',r.status,t)));

// Submit non-JSON payload: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: 'This is not JSON'
}).then(r=>r.text().then(t=>console.log('Non-JSON payload → expect 400, got',r.status,t)));

// Unknown field in payload: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A visionary mathematician’s secret Foundation of scientists on a remote world navigates political and religious crises to guide humanity through the fall of the Galactic Empire.',price:'14.99', unknown:'unknown field'})
}).then(r=>r.text().then(t=>console.log('Unknown field → expect 400, got',r.status,t)));

// Missing id: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing id → expect 400, got',r.status,t)));

// Invalid id pattern: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Invalid id pattern → expect 400, got',r.status,t)));

// Missing title: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing title → expect 400, got',r.status,t)));

// Empty title string: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Empty title → expect 400, got',r.status,t)));

// Title exceeds 150 characters: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'T'.repeat(151),author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Title length >150 → expect 400, got',r.status,t)));

// Missing author: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing author → expect 400, got',r.status,t)));

// Empty author string: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Empty author → expect 400, got',r.status,t)));

// Author exceeds 100 characters: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'A'.repeat(101),year:1951,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Author length >100 → expect 400, got',r.status,t)));

// Missing year: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing year → expect 400, got',r.status,t)));

// Year must be positive: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:0,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Year <=0 → expect 400, got',r.status,t)));

// Year cannot exceed current year: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:new Date().getFullYear()+1,genre:'Science Fiction',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Future year → expect 400, got',r.status,t)));

// Missing genre: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing genre → expect 400, got',r.status,t)));

// Empty genre string: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'',summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Empty genre → expect 400, got',r.status,t)));

// Genre exceeds 50 characters: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'G'.repeat(51),summary:'A short summary.',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Genre length >50 → expect 400, got',r.status,t)));

// Missing summary: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Missing summary → expect 400, got',r.status,t)));

// Summary too short: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'Too short',price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Short summary → expect 400, got',r.status,t)));

// Summary exceeds 1000 characters: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'S'.repeat(1001),price:'14.99'})
}).then(r=>r.text().then(t=>console.log('Long summary → expect 400, got',r.status,t)));

// Missing price: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.'})
}).then(r=>r.text().then(t=>console.log('Missing price → expect 400, got',r.status,t)));

// Price must be positive: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'0'})
}).then(r=>r.text().then(t=>console.log('Non-positive price → expect 400, got',r.status,t)));

// Price with more than two decimals: expect 400
fetch('/api/books',{
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({id:'b7',title:'Foundation',author:'Isaac Asimov',year:1951,genre:'Science Fiction',summary:'A short summary.',price:'12.345'})
}).then(r=>r.text().then(t=>console.log('Price >2 decimals → expect 400, got',r.status,t)));

// Unknown field in update payload: expect 400
fetch('/api/books/b6',{
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({unknown:'unknown field'})
}).then(r=>r.text().then(t=>console.log('Unknown field → expect 400, got',r.status,t)));

// Updating non-existing book b7: expect 404
fetch('/api/books/b7',{
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({title:'Foundation'})
}).then(r=>r.text().then(t=>console.log('Update non-existing b7 → expect 404, got',r.status,t)));

// Attempt to set title to null: expect 400
fetch('/api/books/b6',{
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({title:null})
}).then(r=>r.text().then(t=>console.log('Title null → expect 400, got',r.status,t)));

// Attempt to set author to empty string: expect 400
fetch('/api/books/b6',{
    method:'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({author:''})
}).then(r=>r.text().then(t=>console.log('Author empty → expect 400, got',r.status,t)));

// Attempt to set year to future year: expect 400
fetch('/api/books/b6',{
    method:'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({year:new Date().getFullYear()+1})
}).then(r=>r.text().then(t=>console.log('Year future → expect 400, got',r.status,t)));

// Attempt to set genre to overly long string: expect 400
fetch('/api/books/b6',{
    method:'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({genre:'G'.repeat(51)})
}).then(r=>r.text().then(t=>console.log('Genre too long → expect 400, got',r.status,t)));

// Attempt to set price to negative value: expect 400
fetch('/api/books/b6',{
    method:'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({price:'-5.00'})
}).then(r=>r.text().then(t=>console.log('Price negative → expect 400, got',r.status,t)));

// Attempt to set summary to too short string: expect 400
fetch('/api/books/b6',{
    method:'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({summary:'Too short'})
}).then(r=>r.text().then(t=>console.log('Summary too short → expect 400, got',r.status,t)));

// DELETE book b6 (cleanup): expect 200 or 404
fetch('/api/books/b6',{
    method:'DELETE'
}).then(r=>r.text().then(t=>console.log('Delete b6 → expect 200 or 404 if already gone, got',r.status,t)));
