try {
  JSON.parse("<!DOCTYPE html>");
} catch(e) {
  console.log(e.name, e.message);
}
