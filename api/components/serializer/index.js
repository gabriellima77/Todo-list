const jsontoxml = require('jsontoxml');

class Serializer {
  #json(data) {
    return JSON.stringify(data);
  }

  #setXmlTag(data) {
    return { [this.tagSingular]: data };
  }

  #xml(data) {
    if (Array.isArray(data))
      data = { [this.tagPlural]: data.map((datum) => this.#setXmlTag(datum)) };
    else data = this.#setXmlTag(data);
    return jsontoxml(data);
  }

  serialize(data) {
    data = this.filter(data);
    if (this.contentType === 'application/xml') return this.#xml(data);
    return this.#json(data);
  }

  filterObject(object) {
    const filteredData = {};
    this.publicKeys.forEach((key) => {
      filteredData[key] = object[key];
    });
    console.log(filteredData);
    return filteredData;
  }

  filter(data) {
    if (Array.isArray(data))
      data = data.map((datum) => this.filterObject(datum));
    else data = this.filterObject(data);
    return data;
  }
}

class SerializerTasks extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['id', 'text', 'project'];
    this.tagPlural = 'Tasks';
    this.tagSingular = 'Task';
  }
}

class SerializerError extends Serializer {
  constructor(contentType) {
    super();
    this.contentType = contentType;
    this.publicKeys = ['message', 'id'];
    this.tagPlural = 'Errors';
    this.tagSingular = 'Error';
  }
}

module.exports = {
  Serializer,
  SerializerTasks,
  SerializerError,
  acceptedTypes: ['application/json', 'application/xml'],
};
